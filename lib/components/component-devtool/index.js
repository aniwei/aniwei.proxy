var inspector = require('aniwei.usbmux').inspector,
    express   = require('express'),
    router    = express.Router();


module.exports = function (components, configure, app) {
  var configure,
      socket = app.Socket('devtool');

  components.registe('devtool',{
    className:  'Devtool',
    text:       '远程调试',
    icon:       'request',
    uri:        __dirname
  }, {
    namespace: socket.namespace
  });

  inspector.start(function (bundleManager) {
    var task = bundleManager.watch('com.apple.WebKit.WebContent');

    task.ready(function (pages) {
      var page;

      page = task.inspect(pages.pop());

      page.command(enableTable);
      page.command('Timeline.setInstruments', {
        instruments: [
          'Timeline',
          'ScriptProfiler'
        ]
      });
      page.command('Debugger.setPauseOnException', {
        state: 'none'
      });
      page.command('Page.setShowPaintRects', {
        result: 'true'
      });
      page.command('Runtime.evaluate', {
        expression: 'alert(\'Hello! This is Aniwei Studio\')'
      });

      page.message(function (data) {
        console.log(data)
      });
    });

    task.close(function (pages) {

    });
  });

  router.use(function(req, res, next){
    next();
  });


  return router;
}
