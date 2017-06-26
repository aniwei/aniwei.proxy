var fs            = require('fs'),
    assign        = require('lodash').assign,
    path          = require('path'),
    constants     = require('../helpers').constants,
    reader        = require('../helpers').reader,
    writer        = require('../helpers').writer,
    slice         = [].slice,
    pluginsManager;

pluginsManager = function (factory) {
  if (!(this === pluginsManager.application)) {
    pluginsManager.application = this;
  }

  factory(pluginsManager);
}    

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
  var json = this._json,
      js;

  js = {
    listing: json.listing.filter(function (plugin) {
      return !!plugin.json;
    }).map(function (plugin) {
      return plugin.json();
    }),
    table: json.table,
  };

  if ('updated' in json) {
    js.updated = json.updated;
  }

  return js;
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
      exist   = plugin.path ? fs.existsSync(path.join(plugin.path, 'ui/index.jsx')) : false,
      index,
      plg;

  if (!(plugin.name in json.table)) {
  //   if (plg) {
  //     plugin.settings = plg.settings;
  //   }

  //   listing.splice(index, 1);
  // } else {
    if (plugin.path) {
      if (exist) {
        plugin.ui    = true;
        json.updated = true;
      }
    }

    json.table[plugin.name] = listing.length;
    listing.push(plugin);
  } else {
    index = json.table[plugin.name];
    plg   = listing[index];

    assign(plugin, plg);
    listing[index] = plugin;
  }    

  if (plugin.path) {
    if (exist) {
      if (plugin.ui === false) {
        plugin.ui = true;
      }
    }
  }

  this.save();
}

pluginsManager.listing = function () {
  var json    = this._json,
      listing = json.listing;

  return listing;
}

pluginsManager.isNew = function () {
  var json    = this._json,
      updated = json.updated;

  return !!updated;
}

pluginsManager.updated = function () {
  this._json.updated = false;

  this.save();
}

pluginsManager.get = function (name) {
  var json = this._json,
      index = json.table[name];

  if (typeof index == 'number') {
    return json.listing[index];
  }
}


function Plugin (name, path, on) {
  this.name         = name;
  this.on           = on === undefined ? true : on;
  this.path         = path;
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

  get: function (key) {
    return this.settings[key];
  },

  set: function (key, value) {
    this.settings[key] = value;

    this.save();

    return this;
  },

  json: function () {
    return {
      description: this.description,
      name:     this.name,
      settings: this.settings,
      on:       this.on,
      path:     this.path,
      ui:       this.ui
    };
  },

  runner: function (req, res, next) {
    if (this.on) {
      if (this.router) {
        // console.log('It is piping this router ' + this.name + '.');
        return this.router.handle.apply(this.router, arguments);
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
    } 
    // else {
    //   plugin.settings = defaultSettings;
    // }

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

    return pluginsManager;
  }
});