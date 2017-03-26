var home  = require('user-home'),
    path  = require('path'),
    json  = require('../../package');

module.exports = {
  path: path.join(home, json.name)
};