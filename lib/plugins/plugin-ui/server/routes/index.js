var express = require('express'),
    router  = express.Router();


module.exports = router;

router.get('/', function (req, res) {
  var app     = req.app,
      setting = app.setting;

  res.render('index', {
    initState: JSON.stringify({
      port: setting.get('proxy-port-number')
    })
  });
});