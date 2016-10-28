var io    = require('socket.io'),
    http  = require('http'),
    slice = [].slice,
    toArgv;

toArgv = function (object) {
  return slice.call(object);
}

proto = module.exports = function (router, description) {
  var server    = http.createServer(),
      context   = this,
      isCreated = false;

  io = io(server);

  router.use(function (req, res, next) {
    var app = req.app;

    if (isCreated) {
      return next()
    }

    server.listen(0);
    server.setTimeout(0);

    server.on('listening', function () {
      var addr = server.address();

      context.config('socket', {
        ip:   context.config('ip'),
        port: addr.port,
        uri:  '//' + context.config('ip') + ':' + addr.port
      });

      io.on('connection', function (socket) {
        var io    = app.io,
            cache = io.cache || [];

        socket.emit('connection');

        io.isReady = true;
        io.socket  = socket;

        cache.forEach(function(t){
          var refs = io[t.type];

          if (refs) {
            refs.apply(io, t.argv)
          }
        });

        io.cache = null;
      });

      app.io = {
        isReady: false,
        socket: null,
        cache: [],
        on: typeBuilder('on'),
        off: typeBuilder('off'),
        emit: typeBuilder('emit')
      }

      isCreated = true;

      next();
    });
  })
}

function typeBuilder (method) {
  return function (type) {
    var argv    = toArgv(arguments),
        socket  = this.socket,
        cache   = this.cache,
        refs;

    if (socket) {
      refs = socket[method];
    }


    if (this.isReady) {
      if (refs) {
          refs.apply(socket, argv)
      }
    } else {
      cache.push({
        type: type,
        argv: argv
      });
    }

    return this;
  }
}


proto.description = {
  name:   'socket',
  text:   'socket',
  on:     true,
  uri:  __dirname
}
