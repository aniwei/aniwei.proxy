var socketTable = [],
    slice       = socketTable.slice,
    socket;

module.exports = function (namespace) {
  var socket = new Socket(namespace);

  socketTable.push(socket);
  
  return socket;
};

module.exports.already = function (sock) {
  var soc,
      i = 0;

  socket  = sock;

  socket.on('disconnect', function () {
    var idx = 0,
        sc;

    socket  = null;
    isReady = false;

    while (i < socketTable.length) {
      sc = socketTable[i];
      sc.close(sock);
      i++;
    }
  });

  while(i < socketTable.length) {
    soc = socketTable[i];
    soc.already(sock);
    i++;
  }
}

function Socket (namespace) {
  namespace = namespace || '';

  if (namespace) {
    namespace += '/';
  }

  this.messageTable = [];
  this.sockets      = [];

  Object.defineProperty(this, 'namespace', {
    set: function (ns) {
      namespace = ns ? ns + '/' : '';
    },
    get: function () {
      return namespace;
    }
  });
}

Socket.prototype = {
  close: function (socket) {
    var index;
    
    index = this.sockets.indexOf(socket);

    if (index > -1) {
      this.sockets.splice(index, 1);
    }
  },

  already: function (socket) {
    var ref,
        type,
        table;

    if (this.sockets.indexOf(socket) > -1) {
      return this;
    }

    this.sockets.push(socket);

    table = this.messageTable.slice();

    while (ref = table.pop()) {
      switch (type = ref.type) {
        case 'on':
        case 'once':
        case 'off':
          socket[type](ref.namespace, ref.handle);  
          break;
        case 'emit':
          socket[type].apply(socket, ref.argv);  
          break;
      }
    }
  },

  once: function (name, handle) {
    var namespace = this.namespace + name;

    if (this.sockets.length > 0) {
      return this.sockets.forEach(function (soc) {
        soc.once(namespace, handle);
      });
    }

    this.messageTable.push({
      type:       'once',
      handle:     handle,
      namespace:  namespace
    });

    return this;
  },

  off: function (name, handle) {
    var namespace = this.namespace + name,
        table     = [];

    if (this.sockets.length > 0) {
      return this.sockets.forEach(function (soc) {
        soc.off(namespace, handle);
      });
    }

    this.messageTable.filter(function (object) {
      if (object.namespace == namespace) {
        if (handle === undefined) {
          return true;
        }

        if (object.handle === handle) {
          return true;
        }
      }

      table.push(object);
    });

    this.messageTable = table;

    return this;
  },

  on: function (name, handle) {
    var namespace = this.namespace + name;

    if (this.sockets.length > 0) {
      return this.sockets.forEach(function (soc) {
        soc.on(namespace, handle);
      });
    }

    this.messageTable.push({
      type:       'on',
      handle:     handle,
      namespace:  namespace
    });

    return this;
  },

  emit: function (name) {
    var namespace = this.namespace + name,
        argv      = slice.call(arguments, 1);

    if (this.sockets.length > 0) {
      argv.unshift(namespace);

      return this.sockets.forEach(function (soc) {
        soc.emit.apply(soc, argv);
      });
    }

    this.messageTable.push({
      type:       'emit',
      namespace:  namespace,
      argv:       argv
    });

    return this;
  }
}