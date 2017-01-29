var fs            = require('fs'),
    home          = require('user-home'),
    path          = require('path'),
    plist         = require('plist'),
    assign        = require('lodash').assign,
    json          = require('../package.json'),
    slice         = [].slice,
    meta          = json.meta,
    dataFormat;

dataFormat = {
  value:         undefined,
  writable:      true,
  enumerable:    true,
  configurable:  true
};

module.exports = {
  settings: {},
  get:      get.bind(exports),
  set:      set.bind(exports)
}

function defineProperty (name, description) {
  Object.defineProperty(module.exports.settings, name, description);
}

function get (key) {
  var argv = slice.call(arguments),
      res;

  if (argv.length > 1) {
    res = {};

    argv.forEach(function (key) {
      res[key] = get(key);
    });
  } else {
    return this.settings[key];
  }

  return res;
}

function set (key, value) {
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

  if (object.key in this.settings) {
    this.settings[object.key] = object;
  } else {
    defineProperty(object.key, assign(dataFormat, {
      value: object
    }));
  }

  return this;
}

function init () {
  var path      = filePath(),
      file,
      fileString,
      fileJSON;

  isExist     = fs.existsSync(plist);
  file        = isExist ? path.plist : path.defaultPlist;
  fileString  = fs.readFileSync(file).toString();
  fileJSON    = plist.parse(fileString);

  if (!isExist) {
    fileJSON = assign(fileJSON, {
      'data-cache-path':  {
        'key':   'data-cache-path',
        'text-cn':  '缓存路径',
        'text-en':  'Data Cache Path',
        value: path.root
      },
      'configure-file-path':  {
        'key':   'configure-file-path',
        'text-cn':  '配置文件',
        'text-en':  'Configure Cache Path',
        'value': path.plist
      }
    });
  }

  fs.writeFileSync(path.plist, plist.build(fileJSON));

  this.settings = fileJSON;
}

function filePath () {
  var fileName = meta['configure-plist-file'],
      filePath = meta['cache-path'],
      root     = path.join(home, filePath);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  return {
    root:         root,
    plist:        path.join(root, fileName),
    defaultPlist: path.join(__dirname, 'configure.plist')
  }
}

init.bind(exports)();