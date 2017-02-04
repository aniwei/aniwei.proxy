var path     = require('path'),
    fs       = require('fs'),
    fileName = 'aniwei.proxy-ssl.pem';


module.exports = function (req, res) {
  var app   = req.app,
      root  = app.root,
      root,
      filePath;

  filePath = path.join(__dirname, fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, root.certificate.get('root').cert,function () {
      sendfile(res, filePath)
    });
  } else {
    sendfile(res, filePath)
  }

  
  
}

function sendfile (res, filePath) {
  var stream = fs.createReadStream(filePath);

  stream.pipe(res);
}