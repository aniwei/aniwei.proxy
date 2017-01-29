var proto,
    path      = require('path'),
    urlParser = require('url'),
    http      = require('http'),
    fs        = require('fs'),
    forge     = require('node-forge'),
    project   = require('../package'),
    _         = require('lodash'),
    env       = process.env,
    defaults

proto = module.exports;

// init app
proto.init = function (config) {
  var server   = http.createServer();

  // register configure
  // app extra infomation
  this.config([
    {key: 'project',          value: project.name,            text: '项目名称'},
    {key: 'version',          value: project.version,         text: '版本'},
    {key: 'author',           value: project.author,          text: '作者'},
    {key: 'organization',     value: project.organization,    text: '组织'},
    {key: 'organizationUnit', value: project.organizationUnit,text: '组织部门'},
  ]);

  // app infomation
  this.config([
    {key: 'port',     value: defaults.port,       text: '端口'},
    {key: 'ip',       value: this.network(),      text: 'IP地址'},
    {key: 'cache',    value: defaults.directory,  text: '缓存地址'},
    {key: 'default',  value: defaults,            text: '配置'},
    {key: 'ui',       value: project.organization,text: '视图界面'}
  ]);

  //inset midway
  this.config({
    key:    'midway.built-in',
    value:  ['socket', 'format', 'cert', 'ui', 'mock', 'dns', 'request'],
    text:   '内置中间件'
  })

  this.config({
    key:    'ui',
    value:  {
      hostname: {
        project:  project.name,
        proxy:    project.organization
      },
      root:   path.join(__dirname, '../ui'),
      midway: path.join(__dirname, '../ui/midway/'),
      static: path.join(__dirname, '../ui/static'),
      source: path.join(__dirname, '../ui/src'),
      server: path.join(__dirname, '../ui/server'),
    },
    text:   '内置中间件'
  })

  // certificate config
  this.config({
    key:  'certificate',
    text: '证书配置',
    value: {
      defaultAltname: [project.organization],
      keyPath: path.join(defaults.directory, defaults.privateName),
      certPath: path.join(defaults.directory, defaults.publicName),
      size: 2048,
      attributes: [
        { name: 'organizationName',value: project.organization},
        { shortName: 'OU',value: project.organizationUnit }
      ],
      commonExtensions : [
        { name: 'authorityKeyIdentifier', keyIdentifier: true },
        { name: 'subjectKeyIdentifier' }
      ],
      forgeCommonExtensions : [
        { name: 'extKeyUsage', serverAuth: true, clientAuth: true },
        { name: 'basicConstraints', critical: false, cA: false },
        {
          name: 'keyUsage',
          critical: true,
          digitalSignature: true,
          keyEncipherment: true
        }
      ]
    }
  });

  this.credentials = this.cert();

  this.requestion = function () {
    this.apply(this, arguments);
  }

  this.connection = function (req, soc, head) {
    var url       = urlParser.parse('aw://' + req.url),
        hostname  = url.hostname,
        port      = url.port;

    req.headers['Connection'] = 'Upgrade';
    req.headers['Upgrade'] = 'WebSocket';

    var net = require('net');

    var so = net.connect(8888, '127.0.0.1', function () {
      soc.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      soc.write(head);

      so.pipe(soc);
    });

    soc.pipe(so);

   // this.service(hostname, port, req, soc, head);
  }

  this.requestion = this.requestion.bind(this);
  this.connection = this.connection.bind(this)

  server.on('request', this.requestion);
  server.on('connect', this.connection);

  this.httpServer = server;

  var WebSocketServer = require('websocket').server;

  var wd = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
  });

  wd.on('request', function () {
    debugger;
  })

  this.midway()

  return this;
}

proto.listen = function (port) {
  var defaults = this.config('defaults');

  port = port || defaults.port;
  

  this.httpServer.listen(port);

  return this;
}
