var fs            = require('fs'),
    assign        = require('lodash').assign,
    path          = require('path'),
    constants     = require('../helpers').constants,
    reader        = require('../helpers').reader,
    writer        = require('../helpers').writer,
    slice         = [].slice,
    pluginsManager;

pluginsManager = exports;    

pluginsManager.filename = '.pluginsrc';
pluginsManager.timer    = null;
pluginsManager.default  = function () {
  var file     = path.join(constants.path, this.filename),
      json,
      ui;

    if (!fs.existsSync(constants.path)) {
      fs.mkdirSync(constants.path);
    }
    
    if (fs.existsSync(file)) {
      json = reader(file);
    } else {
      json = {
        listing: [],
        table: {}
      };

      writer(file, json);
    }

    this._json = json;
}

pluginsManager.json = function () {
  var json = this._json;

  return {
    listing: json.listing.filter(function (plugin) {
      return !!plugin.json;
    }).map(function (plugin) {
      return plugin.json();
    }),
    table: json.table
  };
}

pluginsManager.stringify = function () {
  return this.json();
}

pluginsManager.save = function () {
  clearTimeout(this.timer);

  this.timer = setTimeout(function () {
    var file = path.join(constants.path, pluginsManager.filename),
        json = pluginsManager.json();

    writer(file, json);
  }, 250);
}

pluginsManager.push = function (plugin) {
  var json    = this._json,
      listing = this._json.listing,
      index,
      plg;
      
  if (plugin.name in json.table) {
    index = json.table[plugin.name];
    plg   = listing[index];

    if (plg) {
      plugin.settings = plg.settings;
    }

    listing.splice(index, 1);
  }

  json.table[plugin.name] = listing.length;
  listing.push(plugin);    

  this.save();
}

pluginsManager.get = function (name) {
  var json = this._json,
      index = json.table[name];

  if (typeof index == 'number') {
    return json.listing[index];
  }
}


function Plugin (name, on) {
  this.name         = name;
  this.on           = on === undefined ? true : on;
  this.application  = pluginsManager.application;

  pluginsManager.push(this);
}

Plugin.prototype = {
  to: function (name, argv) {
    var plugin = pluginsManager.get(name);

    if (!Array.isArray(argv)) {
      argv = slice.call(arguments, 1);
    }

    plugin.runner.apply(plugin, argv);
  },

  stringify: function () {
    return JSON.stringify(this.json());
  },

  json: function () {
    return {
      name: this.name,
      settings: this.settings,
      on: this.on
    };
  },

  runner: function (req, res, next) {
    if (this.on) {
      if (this.router) {
        return this.router.handle(req, res, next);
      }
    }

    return next();
  },

  save: function () {
    pluginsManager.save();
  }
};

Object.defineProperty(Plugin.prototype, 'defaultSettings', {
  set: function (defaultSettings) {
    var plugin = pluginsManager.get(this.name);

    if (plugin) {
      if (!plugin.setting) {
        plugin.settings = defaultSettings;
      }
    } else {
      plugin.settings = defaultSettings;
    }

    this.save();
  }
});

Object.defineProperty(Plugin.prototype, 'router', {
  set: function (router) {
    var type    = typeof router,
        plugin  = this;

    if (type == 'object' || type == 'function') {
      this._router = router;

      pluginsManager.application.use(plugin.runner.bind(this));
    }
  }, 
  get: function () {
    return this._router;
  }
});

pluginsManager.Plugin = Plugin;

Object.defineProperty(module, 'exports', {
  get: function () {
    if (!pluginsManager.plugins) {
      pluginsManager.default();
    }

    return function (factory) {
      if (!(this === pluginsManager.application)) {
        pluginsManager.application = this;
      }

      factory(pluginsManager);
    }
  }
});