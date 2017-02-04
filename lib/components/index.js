var express   = require('express'),
    path      = require('path'),
    plist     = require('plist'),
    fs        = require('fs'),
    componentsManager;



componentsManager = function (store, configure, app) {
  var components = store.get('components');

  if (!components) {
    store.set('components', components = {});
  }

  return {
    registe: function (key, brief) {
      components[key] = description
    },

    all: function () {
      var keys = Object.keys(components);

      return keys.map(function (key) {
        return {
          key:    key,
          brief:  components[key]
        }
      });
    }
  }
}

module.exports = function (store, configure, app) {
  var fileString,
      filePath,
      fileJSON,
      table,
      router;

  filePath = path.join(__dirname, './component.plist');
  router   = express.Router();

  app.component = componentsManager;

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

      rou = cmp(componentsManager, configure, app)

      router.use(rou);
    }
  }).bind(this));

  return router;
}
