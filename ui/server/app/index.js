var express = require('express'),
    path    = require('path'),
    router  = express.Router();

router.use(require('./router/index'));
router.use(express.static(path.join(__dirname,'static')));



module.exports = router;
