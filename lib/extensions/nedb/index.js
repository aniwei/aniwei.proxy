const Store    = require('nedb-promise');
const path     = require('path');
const fs       = require('fs-extra-promise');


module.exports = async function (app, options) {
  app.nedb = function (name) {
    const filename = path.resolve(app.path, `${name}.db`);

    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '');
    }
  
    const nedb = Store({
      filename,
      autoload: true
    });

    return nedb;
  };
}