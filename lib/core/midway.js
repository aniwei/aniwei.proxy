var express     = require('express'),
    _           = require('lodash'),
    rootRouter  = express.Router(),
    fs          = require('fs'),
    path        = require('path'),
    proto;

proto = module.exports = function () {
  var components,
      ui = this.config('ui');

  this.use(rootRouter);

  proto.register        = proto.register.bind(this);
  proto.builtIn         = proto.builtIn.bind(this);
  proto.get             = proto.get.bind(this);

  proto.builtIn(this.config('midway.built-in'));

  components = this.config('the components');
}

proto.get = function (name) {
  var cmps = this.config('the components'),
      cmp;

  if (cmps) {
    cmps.some(function(c){
      if (c.name == name) {
        return cmp = c;
      }
    });
  }

  return cmp;
}

proto.register = function (desc, factory, position) {
  var cmps    = this.config('the components'),
      router  = express.Router(),
      config;

  if (factory === undefined) {
    return this;
  }

  if (!cmps) {
    this.config('the components', cmps = []);
  }

  desc = _.assign({
    name:       'anonymous',
    text:       'anonymous',
    on:         true,
    configure:  config = {}
  }, desc);

  cmps.push(desc);

  rootRouter.use(function (req, res, next) {
    if(desc.on) {
      return router.handle(req, res, next)
    }
  });

  router.use(function(req, res, next){
    var headerName = 'X-Component-Path',
        value = res.getHeader(headerName);

    value = value ?
      value + '->' + desc.name : desc.name

    res.setHeader(headerName, value);

    next();
  });

  if (typeof factory == 'function') {
    factory.apply(this, [router, desc]);
  }
}

proto.builtIn = function (midway) {
  var prefix    = '../midway/midway-',
      register  = proto.register,
      ui        = this.config('ui'),
      views     = []

  midway.forEach(function(name, index){
    var dir     = prefix + name,
        cmp     = 'midway-' + name,
        factory = require(dir);

    factory.description.dir = path.join(__dirname, dir);
    factory.description.ui  = cmp;

    register(factory.description, factory, index);
  });
}
