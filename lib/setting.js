var fs            = require('fs'),
    assign        = require('lodash').assign,
    path          = require('path'),
    constants     = require('./helpers').constants,
    reader        = require('./helpers').reader,
    writer        = require('./helpers').writer,
    slice         = [].slice,
    timer,
    dataFormat;

dataFormat = {
  value:         undefined,
  writable:      true,
  enumerable:    true,
  configurable:  true
};

exports.filename = '.settingrc';

// 设置默认配置，并创建缓存文件夹;首次，将保存配置到缓存目录
exports.default = function () {
  var file     = path.join(constants.path, this.filename),
      original = path.join(__dirname, this.filename),
      json,
      ui;

    if (!fs.existsSync(constants.path)) {
      fs.mkdirSync(constants.path);
    }
    
    if (fs.existsSync(file)) {
      json = reader(file);
    } else {
      json      = reader(original);
      this.json = json;
      ui        = this.get('user-interface');
      
      ui.root = path.join(__dirname, '..', ui.root);

      writer(file, json);
    }

    this.json = json;
}

exports.save = function () {
  var filename = this.filename,
      json     = this.json;

  clearTimeout(timer);

  timer = setTimeout(function () {
    file = path.join(constants.path, filename);

    writer(file, json);
  }, 100);
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
  var object,
      type = typeof key;

  if (value === undefined) {
    if (type === 'object') {
      return Object.keys(key).forEach(function (setter) {
        if (
          typeof setter === 'object' &&
          'key' in setter &&
          'value' in setter
        ) {
          set(setter.key, setter.value);
        }
      });
    } else {
      return this;
    }
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
    Object.defineProperty(this.json, object.key, assign(dataFormat, {
      value: object
    }));
  }

  this.save();

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