const path     = require('path');
const fs       = require('fs-extra-promise');

module.exports = async function (app, options) {
  debugger;
  const { nedb, json } = app;
  const meta = json.meta;
  const store = nedb('settings');
  const { PORT, PROXY_PORT } = process.env;

  app.set = async function (setting) {
    if (Array.isArray(setting)) {
      await Promise.all(setting.map(set => store.update(set)));
    } else {
      await store.update(setting);
    }
  }

  app.get = async function (key) {
    const res = await store.findOne({key});

    return res.value;
  }

  await app.set([
    { key: 'name', value:  options.name || meta.name, desc:   '应用名称' },
    { key: 'path', value:  app.path, desc:   '缓存目录' },
    { key: 'port', value:  options.port || PROXY_PORT || PORT, desc:   '代理端口' }
  ]);
}