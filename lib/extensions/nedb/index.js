const Store    = require('nedb-promise');
const path     = require('path');
const fs       = require('fs-extra-promise');


module.exports = async function (app, options) {
  const filepath = options.filepath;
  const exist = await fs.existsAsync(path.resolve(filepath));

  if (!exist) {
    
  }

  const nedb = Store({
    filename: path.resolve(__dirname, 'data.db'),
    autoload: true
  });

  app.nedb = nedb;
}