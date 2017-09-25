const path     = require('path');
const fs       = require('fs-extra-promise');
const home     = require('user-home');
const json     = require('../../../package.json');

module.exports = async function (app, options) {
  const filepath = options.filepath || path.resolve(home, json.name); 
  const exist = await fs.existsAsync(filepath);

  if (!exist) {
    await fs.mkdirAsync(filepath);
  }
}