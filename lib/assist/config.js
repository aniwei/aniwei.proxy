var _     = require('lodash'),
    key   = 'the proxy configures',
    model = {
      value:  undefined,
      text:   'anonymous',
      hidden: true
    };

module.exports = function configHandle (name, value) {
  var config = this.get(key),
      that   = this,
      refer

  if (!config) {
    this.set(key, config = {});
  }

  //app.config([{key}])
  //app.config({key})
  if (Array.isArray(name)) {
    return name.forEach(function(n){
      configHandle.call(that, n);
    });
  }

  // app.config(key, value);
  // app.config(key) return value;
  // app.config({key,text,value});
  return typeof name == 'string' ?
    configString(config, name, value) : configObject(config, name, value);
}

function configObject (config, name) {
  var refer,
      key;

  key   = name.key;
  refer = config[key];

  if (key === undefined) {
    return this;
  }

  if (!refer) {
    if (name.hidden === undefined) {
      name.hidden = false;
    }

    Object.defineProperty(config, key, {
      value:      refer = _.assign({key: key}, model, name),
      enumerable: refer.hidden ? false : true
    });
  }

  refer.value = name.value;
}

function configString (config, name, value) {
  var refer;

  refer = config[name];

  if (!refer) {
    Object.defineProperty(config, name, {
      value:      refer = _.assign({key: name}, model),
      enumerable: false
    });
  }

  if (value === undefined) {
    return refer.value;
  }

  refer.value = value;
}
