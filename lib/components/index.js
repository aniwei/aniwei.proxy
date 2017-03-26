var express   = require('express'),
    path      = require('path'),
    plist     = require('plist'),
    fs        = require('fs'),
    assign    = require('lodash').assign,
    componentsManager;

componentsManager = function (store, configure, app) {
  var components = store.get('components');

  if (!components) {
    store.set('components', components = {});
  }

  return {
    registe: function (key, brief, config) {
      var cmp = components[key];

      if (cmp) {
        brief  = assign(brief, cmp.brief);
        config = assign(brief, cmp.config);
      }

      if (fs.existsSync(path.join(brief.uri, 'ui'))) {
        brief.ui = true;        
      }

      cmp = components[key] = {
        brief:  brief,
        config: assign(config)
      }

      store.write();

      return new Config(cmp.config, store);
    },

    all: function () {
      var keys = Object.keys(components);

      return keys.map(function (key) {
        return {
          key:    key,
          component:  components[key]
        }
      });
    }
  }
}

module.exports = function (store, configure, app) {
  var fileString,
      filePath,
      fileJSON,
      tablePath,
      table,
      router;

  filePath = path.join(__dirname, './component.plist');

  router   = express.Router();

  app.component = componentsManager(store, configure, app);

  if (!fs.existsSync(filePath)) {
    return this;
  }

  fileString = fs.readFileSync(filePath).toString();
  fileJSON   = plist.parse(fileString);
  table      = Object.keys(fileJSON);
  
  table.forEach((function (name) {
    var dir = path.join(__dirname, name),
        rou,
        cmp;

    if (fs.existsSync(dir)) {
      cmp = require(dir);

      rou = cmp(app.component, configure, app)

      router.use(rou);
    }
  }).bind(this));

  return router;
}

function Config (defaultConfig, store) {
  this.json   = defaultConfig || {};
  this.store  = store;
}

Config.prototype = {
  constructor: Config,
  get: function (key) {
    return this.configTable[key];
  },
  set: function (key, value) {
    this.json[key] = value;

     this.store.write();
  }
}