var fs            = require('fs'),
    os            = require('os'),
    path          = require('path'),
    assign        = require('lodash').assign,
    clone         = require('lodash').clone,
    constants     = require('./helpers').constants,
    reader        = require('./helpers').reader,
    writer        = require('./helpers').writer,
    slice         = [].slice;


var exports = {};

exports.filename = '.storerc';

exports.write = function () {
  var timer,
      file = path.join(constants.path, this.filename) ;

  this.write = function () {
    var json = this.json;

    clearTimeout(timer);

    timer = setTimeout((function () {
      writer(file, json);
    }).bind(this), 200);
  };

  this.write();
}

exports.set = function set (key, value) {
  if (typeof key == 'object') {
    return Object.keys(key).forEach((function (setter) {
      this.set(setter, key[setter]);
    }).bind(this));
  }

  this.json[key] = value;

  this.write();
}

exports.get = function get (key) {
  var argv = slice.call(arguments),
      res;

  if (argv.length > 1) {
    res = {};

    argv.forEach(function (key) {
      res[key] = get(key);
    });
  } else {
    return this.json[key];
  }

  return res;
}

exports.default = function () {
  var file = path.join(constants.path, this.filename),
      json;

  if (fs.existsSync(file)) {
    json = reader(file);
  } else {
    writer(file, json = {});
  }

  this.json = json;
}

Object.defineProperty(module, 'exports', {
  get: function () {
    if (!this.json) {
      exports.default();
    }

    return exports;
  }
});
