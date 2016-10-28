var proto

proto = module.exports = function (router, description) {
  var context = this,
      project = this.config('project'),
      cert    = this.config('certificate');

  router.use(function(req, res, next){
    var proxy = req.proxy;

    if (proxy.hostname == project) {
      if (proxy.pathname == '/download/cert') {
        return res.sendfile(cert.certPath)
      }
    }

    next()
  })
}

proto.description = {
  name: 'cert',
  text: '证书下载',
  on:   true,
  uri:  __dirname
}
