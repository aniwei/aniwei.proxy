var express = require('express'),
    router  = express.Router();


['main', 'configure', 'socket'].forEach(function (api) {
  router.get('/' + api, require('./' + api));
});

module.exports = router;
