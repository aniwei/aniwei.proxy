var express      = require('express'),
    qs           = require('query-string'),
    urlParser    = require('url'),
    path         = require('path'),
    domainParser = require('domain-name-parser'),
    os           = require('os'),
    request      = require('request'),
    api          = require('./api'),
    router       = express.Router();


module.exports = router;

router.use(api.settings);

router.get('/feedback', api.feedback);

router.get('/last-step', api.lastStep);

router.get('/ico', api.ico);

router.get('/ssl.crt', api.ssl);

router.get('/', require('./render'));