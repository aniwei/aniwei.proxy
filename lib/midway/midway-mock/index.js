var proto

proto = module.exports = function (router, description) {
  var configure   = description.configure,
      interfaces  = configure.interfaces = [];

  router.use(function(req, res, next){
    if (interfaces.some(function(inter, i){

    })) {

    }

    next()
  });
}

proto.description = {
  name:   'mock',
  text:   '数据借口模拟',
  on:     true
}
