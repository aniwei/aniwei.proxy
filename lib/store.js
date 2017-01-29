var fs            = require('fs'),
    os            = require('os'),
    home          = require('user-home'),
    path          = require('path'),
    plist         = require('plist'),
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
  set: function set (key, value) {
    var store,
        object;

    if (Array.isArray(key)) {
      return key.forEach((function (setter) {
        this.set(setter);
      }).bind(this));
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

  isExist     = fs.existsSync(plist);
  fileJSON    = {
    ip: network()
  };

  if (!isExist) {
    fs.writeFileSync(path.plist, plist.build(fileJSON)); 
  } else {
    fileJSON = assing(plist.parse(fs.readFileSync(path.plist).toString()), fileJSON);
  }

  this.stores = fileJSON;
}

// 获取本机ip
function network () {
  var ni    = os.networkInterfaces(),
      keys  = Object.keys(ni),
      local = '127.0.0.1',
      handle,
      ip;

  handle = function (n) {
    var family  = (n.family || '').toLowerCase(),
        address = n.address;

    if (family == 'ipv4') {
      if (!(address == local)) {
        return ip = address;
      }
    }
  }

  keys.some(function (name) {
    var ls = ni[name] || [];

    if (ls.length > 0) {
      return ls.some(handle);
    }
  });

  return ip || local;
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

init.bind(exports)();