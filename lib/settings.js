var fs            = require('fs'),
    assign        = require('lodash').assign,
    path          = require('path'),
    constants     = require('./helpers').constants,
    reader        = require('./helpers').reader,
    slice         = [].slice,
    dataFormat;

dataFormat = {
  value:         undefined,
  writable:      true,
  enumerable:    true,
  configurable:  true
};

exports.filename = '.settingsrc';

// 设置默认配置，并创建缓存文件夹;首次，将保存配置到缓存目录
exports.default = function () {
  var file     = path.join(constants.path, this.filename),
      original = fs.readFileSync(path.join(__dirname, this.filename)),
      now;

    if (!fs.existsSync(constants.path)) {
      fs.mkdirSync(constants.path);
    }
    
    json = JSON.parse(original);

    if (fs.existsSync(file)) {
      now  = fs.readFileSync(file);
      json = JSON.parse(now);
    } else {
      fs.writeFileSync(file, original);
    }

    this.json = json;
}

exports.get = function get (key) {
  var argv = slice.call(arguments),
      res;

  if (argv.length > 1) {
    res = {};

    argv.forEach(function (key) {
      res[key] = get(key).value;
    });
  } else {
    return (this.json[key] || {}).value;
  }

  return res;
}

exports.set = function set (key, value) {
  var argv = slice.call(arguments),
      store,
      object;

  if (argv.length > 1) {
    return argv.forEach(function (setter) {
      set(setter);
    });
  }

  if (typeof key == 'string') {
    object = {
      key:   key,
      value: value
    };
  }

  if (object.key in this.json) {
    this.json[object.key] = object;
  } else {
    defineProperty(object.key, assign(dataFormat, {
      value: object
    }));
  }

  return this;
}


Object.defineProperty(module, 'exports', {
  get: function () {
    if (!exports.json) {
      exports.default();
    }

    return exports;
  }
});