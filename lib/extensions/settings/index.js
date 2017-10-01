const path     = require('path');
const fs       = require('fs-extra-promise');

module.exports = async function (app, options) {
  const meta = app.json.meta;
  const store = app.nedb('settings');

  app.set = async function (setting) {
    if (Array.isArray(setting)) {
      await Promise.all(setting.map(async (set) => await app.set(set)));
    } else {

      const exist = await store.findOne(setting);

      exist ?
        await store.update(setting, setting) : await store.insert(setting);
    }
  }

  app.get = async function (key) {
    const res = await store.findOne({key});

    return (res || {}).value;
  }

  const file  = path.join(__dirname, 'default.js');
  const exist = await fs.existsAsync(file);

  if (exist) {
    await require(file)(app, options, meta);
    await fs.renameAsync(file, path.join(__dirname, '__default.js'));
  }
}