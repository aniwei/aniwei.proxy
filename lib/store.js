var fs            = require('fs'),
    os            = require('os'),
    home          = require('user-home'),
    path          = require('path'),
    plist         = require('plist'),
    assign        = require('lodash').assign,
    clone         = require('lodash').clone,
    json          = require('../package.json'),
    slice         = [].slice,
    meta          = json.meta;

module.exports = {
  stores:   {},
  get: function get (key) {
    var argv = slice.call(arguments),
        res;

    if (argv.length > 1) {
      res = {};

      argv.forEach(function (key) {
        res[key] = get(key);
      });
    } else {
      return this.stores[key];
    }

    return res;
  },

  all: function () {
    return this.stores
  },

  set: function set (key, value, rewrite) {
    var store,
        object,
        exists;

    rewrite = rewrite === undefined ? false : rewrite;

    if (typeof key == 'object') {
      return Object.keys(key).forEach((function (setter) {
        this.set(setter, key[setter]);
      }).bind(this));
    }

    if (!rewrite) {
      exists = this.stores[key];

      if (exists) {
        value = clone(exists, true);
      }
    }

    this.stores[key] = value;

    this.save();

    return this;
  },

  save: function save() {
    var timer,
        path      = filePath();

    this.save = (function () {
      var stores = this.stores;

      clearTimeout(timer);

      timer = setTimeout((function () {
        fs.writeFile(path.plist, plist.build(stores));
      }).bind(this), 200);
    }).bind(this);

    this.save();
  }
}

function init () {
  var path      = filePath(),
      file,
      fileString,
      fileJSON;

  isExist     = fs.existsSync(path.plist);
  fileJSON    = {};

  if (!isExist) {
    fs.writeFileSync(path.plist, plist.build(fileJSON)); 
  } else {
    fileJSON = clone(plist.parse(fs.readFileSync(path.plist).toString()), true);
  }

  this.stores = fileJSON;
}

function filePath () {
  var fileName = meta['store-plist-file'],
      filePath = meta['cache-path'],
      root     = path.join(home, filePath);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  return {
    root:         root,
    plist:        path.join(root, fileName)
  }
}

init.bind(module.exports)();