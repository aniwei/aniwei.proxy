var path = require('path'),
    fs   = require('fs');

module.exports = function (file) {
  var format = path.parse(file),
      string;

  switch (format.ext) {
    case '.json':
    case '.js':
    case '.node':
      return require(file);
    default:
      string = fs.readFileSync(file);
      return JSON.parse(string);
  }
}