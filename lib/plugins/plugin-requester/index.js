var urlParser = require('url'),
    http      = require('http'),
    https     = require('https'),
    zlib      = require('zlib'),
    mime      = require('mime'),
    uuid      = require('uuid').v4,
    path      = require('path'),
    express   = require('express'),
    assign    = require('lodash').assign,
    home      = require('user-home'),
    fs        = require('fs'),
    fsExtra   = require('fs-extra'),
    router    = express.Router();


module.exports = function (pluginsManager) {
  var plugin  = new pluginsManager.Plugin('requester', __dirname),
      router  = express.Router(),
      buffer  = [],
      app     = plugin.application,
      setting = app.setting,
      fileManager;

  var filePath = path.join(
    home, 
    setting.get('project'), 
    setting.get('temporary-root')
  );

  var cacheControl = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  fileManager = new FileManager(filePath);

  plugin.description = {
    text: '资源请求',
    brief: '资源请求模块，用于发送代理请求，并将结果返回。'
  };

  plugin.defaultSettings = {
    disableCache: false
  };

  plugin.router  = router;
  plugin.version = '0.0.1';

  plugin.clear = function () {
    fileManager.clear();
  }

  router.get('/plugin/requester/buffer', function (req, res) {
    var url   = req.query.url,
        readable;

    readable = fileManager.fileReader(url, res);
  });

  router.get('/plugin/requester/size', function (req, res) {
    res.json({
      code: 0,
      size: fileManager.size()
    });
  });

  router.use(function (req, res, next) {
    var proxy   = req.proxy,
        client  = proxy.protocol == 'http:' ? http : https,
        app     = req.app,
        isCache = !plugin.get('disableCache'),
        requ;

    // delete proxy.headers['Proxy-Connection'];
    // delete proxy.headers['proxy-connection'];

    if (!isCache) {
      assign(proxy.headers, cacheControl);
    }

    requ = client.request({
      hostname: proxy.ip,
      port:     proxy.port,
      path:     proxy.path,
      method:   proxy.method,
      headers:  proxy.headers,
      rejectUnauthorized: false
    }, function(resp){
      var headers         = resp.headers,
          contentType     = headers['content-type'] || headers['Content-Type'] || mime.lookup(proxy.pathname) || 'application/octet-stream',
          contentEncoding = headers['content-encoding'] || headers['Content-Encoding'],
          type,
          url,
          ext;

      ext = mime.extension(contentType);
      url = decodeURIComponent(escape(proxy.url));

      resp.on('end', function () {
        app.emit('proxy/receive', {
          id:           proxy.id,
          code:         resp.statusCode,
          message:      resp.statusMessage,
          headers:      resp.headers,
          type:         mime.lookup(ext || ''),
          extension:    ext,
          from:         'receive'    
        });
      });  

      if (!isCache) {
        assign(headers, cacheControl);
      }

      res.writeHead(resp.statusCode, headers);
      resp.pipe(res);

      if (!app.local(proxy) || (proxy.pathname === '/favicon.ico')) {
        if (!fileManager.exists(url)) {
          fileManager.file(resp, url, contentType, contentEncoding);
        }
      }
     
    });

    requ.on('error', function(err){
      req.proxy.error = err;

      next();
    });

    requ.on('response', function () {});

    if (proxy.readable) {
      if (proxy.readable.length > 0) {
        requ.write(proxy.readable);
      }
      
      requ.end();
    } else {
      requ.end();
    }
  });
}

function createTemporary (filePath) {
  var isExisted = fs.existsSync(filePath);

  if (!isExisted) {
    fs.mkdirSync(filePath);
  }
}

function FileManager (filePath, timeout) {
  this.path     = filePath;
  this.filePath = path.join(filePath, 'files');
  this.jsonFile = path.join(filePath, '.filesrc');
  this.timeout  = timeout;
  this.timer    = 0;
  this.fileSize = 0;

  this.createTemporary();
}

FileManager.prototype = {
  createTemporary: function () {
    var jsonString;

    [ { path: this.path, type: 'directory' }, 
      { path: this.filePath, type: 'directory' },
      { path: this.jsonFile, type: 'file' }
    ].forEach(function (li) {
      if (!fs.existsSync(li.path)) {
        li.type === 'directory' ? 
          fs.mkdirSync(li.path) : 
          fs.writeFileSync(li.path, JSON.stringify(this.json = {
            list: {},
            size: 0
          }, null, 2));
      }
    });

    if (!this.json) {
      jsonString = fs.readFileSync(this.jsonFile);

      this.json     = JSON.parse(jsonString);
      this.fileSize = this.json.size;
    }

    return this;
  },

  jsonWriter: function (json) {
    clearTimeout(this.timer);

    if (json) {
      this.json.list[json.url] = json;
    }

    this.timer = setTimeout((function () {
      fs.writeFile(this.jsonFile, JSON.stringify(this.json, null, 2))
    }).bind(this), this.timeout);
  },

  fileReader: function (url, res) {
    var file     = this.json.list[url],
        path,
        readable;

    if (file) {
      path      = file.meta.path,
      readable  = fs.createReadStream(path);

      res.setHeader('Content-Type', file.mime);

      if (file.encoding) {
        res.setHeader('Content-Encoding', file.encoding);
      }

      readable.pipe(res);
      // readable.on('end', (function () {
      //   fs.unlink(path, (function () {
      //     delete this.json[url];

      //     this.json.size -= file.size;

      //     this.jsonWriter();
      //   }).bind(this));
      // }.bind(this)));

      return readable;
    } else {
      res.end();
    }
  },

  exists: function (url) {
    if (url in this.json.list) {
      return true;
    }

    return false;
  },

  file: function (readable, url, mime, encoding) {
    var name      = uuid(),
        filePath  = path.join(this.filePath, name),
        writeable,
        json;

    writeable = fs.createWriteStream(filePath);

    json = {
      url: url,
      meta: {
        name: name,
        path: filePath
      },
      mime: mime,
      encoding: encoding
    };

    readable.on('data', function (chunk) {
      if (writeable.write(chunk) === false) { 
        readable.pause();
      }
    });

    writeable.on('drain', function () {
      readable.resume();
    });

    readable.on('end', (function () {
      writeable.end();

      process.nextTick((function () {
        fs.stat(filePath, (function (err, stat) {
          if (err) {
            return this;
          }

          json.meta.size = stat.size;

          this.fileSize += stat.size;
          this.json.size = this.fileSize;

          this.jsonWriter(json, function () {});
        }).bind(this));
      }).bind(this));
      
    }).bind(this));

    return writeable;
  },

  clear: function () { 
    fsExtra.remove(this.filePath, (function () {
      this.json = { list: {}, size: 0 };
      this.jsonWriter();

      fs.mkdirSync(this.filePath);
    }).bind(this));
  },

  size: function () {
    return this.fileSize;
  }
}