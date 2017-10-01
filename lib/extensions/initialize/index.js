const path     = require('path');
const fs       = require('fs-extra-promise');
const home     = require('user-home');
const json     = require('../../../package.json');

module.exports = async function (app, options) {
  const meta = json.meta;
  let filepath = options.path;

  if (filepath) {
    filepath = path.isAbsolute(filepath) ?
      path.resolve(home, filepath) : filepath;
  } else {
    filepath = path.resolve(home, meta.name);
  }

  const exist = await fs.existsAsync(filepath);

  if (!exist) {
    await fs.mkdirAsync(filepath);
  }

  app.json        = json;
  app.path        = filepath;
  app.initialzed  = !!exist;
}