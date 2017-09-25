const fs        = require('fs-extra-promise');
const forge     = require('node-forge');
const path      = require('path');
const assign    = require('loadsh.assign');

const fullName  = require('./fullName');
const shortName = require('./shortName');
const config    = require('./config');

module.exports = function (app, options) {
  const { settings, nedb } = app.settings;

  const forger = function () {

  }



  app.forger = forger;
}

