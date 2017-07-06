var express = require('express'),
    router  = express.Router();


router.get('/settings/list/clear', function (req, res) {
  var app      = req.app,
      plugins  = app.plugins;

  plugins.get('requester').clear();

  res.json({
    code: 0
  });
});

router.post('/settings/list/pinned', function (req, res) {
  var app         = req.app,
      setting     = app.setting,
      pinnedKeys  = req.body.pinnedKeys,
      listSetting;

  listSetting = setting.get('list-settings');

  if (listSetting === undefined) {
    setting.set('list-settings', listSetting = {});
  }

  listSetting.pinnedKeys = pinnedKeys;

  res.json({
    code: 0,
    pinnedKeys: pinnedKeys
  });
});

router.get('/settings/list/export.json', function (req, res) {
  var app         = req.app,
      setting     = app.setting,
      list       = req.body.list;

  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(JSON.stringify(list, null, 2));
});

router.post('/settings/list/import', function (req, res) {

});

router.post('/settings/list/tools', function (req, res) {
  var app         = req.app,
      setting     = app.setting,
      tools       = req.body.tools,
      plugins     = app.plugins,
      listSetting;

  listSetting = setting.get('list-settings');

  if (listSetting === undefined) {
    setting.set('list-settings', listSetting = {});
  }

  listSetting.tools = tools;

  plugins.get('requester').set('disableCache', tools.disableCache);
  plugins.get('ui').set('record', tools.record);
  plugins.save();

  setting.save();

  res.json({
    code: 0,
    tools: tools
  });
});

module.exports = router;