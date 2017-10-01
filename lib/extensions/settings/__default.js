module.exports = async function (app, options, meta) {
  const { PROXY_PORT, PORT } = process.env;

  await app.set([
    { key: 'name', value:  options.name || meta.name, desc:   '应用名称' },
    { key: 'path', value:  app.path, desc:   '缓存目录' },
    { key: 'port', value:  options.port || PROXY_PORT || PORT || 8888, desc:   '代理端口' }
  ]); 
}