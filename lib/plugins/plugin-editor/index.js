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
    router    = express.Router();


module.exports = function (pluginsManager) {
  var plugin  = new pluginsManager.Plugin('editor', __dirname),
      router  = express.Router(),
      buffer  = [],
      app     = plugin.application,
      setting = app.setting,
      fileManager;

  filePath = path.join(
    home, 
    setting.get('project'), 
    setting.get('temporary-root')
  );

  fileManager = new FileManager(filePath);

  plugin.description = {
    text: '资源编辑',
    brief: '提供资源编辑，用于线上调试'
  };

  plugin.defaultSettings = {};

  plugin.router = router;

  router.get('/plugin/requester/buffer', function (req, res) {
    var url   = req.query.url,
        readable;

    readable = fileManager.fileReader(url, res);
  });

  router.use(function (req, res, next) {
    next();
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
    
  },

  size: function () {
    return this.fileSize;
  }
}