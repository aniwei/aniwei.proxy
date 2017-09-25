const Store    = require('nedb-promise');
const path     = require('path');
const fs       = require('fs-extra-promise');


module.exports = async function (app, options) {
  const filepath = options.filepath;

  app.nedb = function (name) {
    const nedb = Store({
      filename: path.resolve(__dirname, `${name}.db`),
      autoload: true
    });

    return nedb;
  };
}