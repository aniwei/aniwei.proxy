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

// api
router.get('/last-step', api.lastStep);
router.get('/ico', api.ico);
router.get('/ssl.crt', api.ssl);
router.use('/resource', api.resouce);

// view render
router.get('/', require('./view').render);