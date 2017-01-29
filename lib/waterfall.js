var async = require('async'),
    noop  = function () {};

module.exports = {
  water: [],

  waterfall: function (handle) {
    handle = handle || noop;

    this.water.push(handle);

    return this;
  },
  
  run : function (argv, done) {
    var water;

    if (!Array.isArray(argv)) {
      argv = [argv];
    }

    done  = done || noop;
    water = this.water.map(function (water) {
      return function (done) {
        water.apply(null, [done].concat(argv));
      }
    });

    async.waterfall(this.water, done);

    return this;
  }  
}