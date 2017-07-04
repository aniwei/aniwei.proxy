import React, { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { ServerStyleSheet } from 'styled-components';
import ControlsContext from 'controls-context';
import os from 'os';

import Routing, { store } from './jsx';

export function render (req, res) {
  const app       = req.app,
        setting   = app.setting,
        plugins   = app.plugins,
        plugin    = app.plugin,
        lastStep  = plugin.get('the last step');

  if (lastStep) {
    plugin.set('the last step', undefined);

    return res.redirect(lastStep);
  }

  const sheet = new ServerStyleSheet();
  
  const htmlString = renderToString(sheet.collectStyles(
    <ControlsContext>
      <Routing />
    </ControlsContext>
  ));

  const styleString = sheet.getStyleTags();

  res.render('index', {
    htmlString,
    styleString,
    initState: store.getState()
  });
}

// 获取本机ip
function network () {
  var ni    = os.networkInterfaces(),
      keys  = Object.keys(ni),
      local = '127.0.0.1',
      handle,
      ip;

  handle = function (n) {
    var family  = (n.family || '').toLowerCase(),
        address = n.address;

    if (family == 'ipv4') {
      if (!(address == local)) {
        return ip = address;
      }
    }
  }

  keys.some(function (name) {
    var ls = ni[name] || [];

    if (ls.length > 0) {
      return ls.some(handle);
    }
  });

  return ip || local;
}
