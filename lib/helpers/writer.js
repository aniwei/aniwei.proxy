var fs   = require('fs');

module.exports = function (file, string) {
  var json;

  if (typeof string == 'string') {
    json = string;
  } else {
    json = JSON.stringify(string, null, 2);
  }

  fs.writeFileSync(file, json);
}