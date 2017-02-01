var express   = require('express'),
    path      = require('path'),
    plist     = require('plist'),
    fs        = require('fs'),
    componentsManager;



componentsManager = function (store, configure, app) {
  var fileString,
      filePath,
      fileJSON,
      table,
      router;

  filePath = path.join(__dirname, './component.plist');
  router   = express.Router();

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

      rou = cmp(store, configure, app)

      router.use(function (req, res, next) {
        
      });
    }
  }).bind(this));

  return {
    router:  router,
    registe: function (description, router) {

    }
  }
}

function init () {
  
}

module.exports = componentsManager;