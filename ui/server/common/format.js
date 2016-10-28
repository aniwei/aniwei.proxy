var _ = require('lodash');

module.exports = function (keyName, data) {
  var value = this.code.get(keyName);

  return _.assign({}, value, {
    data: data
  });
}
