import React from 'react';
import SocketClient from 'socket.io-client';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ExtensionContext from 'aniwei-proxy-extension-context';

import List from './container/list';
import Extensions from './container/extensions';
import Settings from './container/settings';

import Routing from './routing';
import './extensions';


// data
// import list from './data/list.json';

const initState = window.__initState__;

const menus = [
  {key: 'send', route: 'list', text: '请求数据', active: false, component: List},
  {key: 'app', route: 'extensions', text: '设置', active: false, component: Extensions},
  {key: 'setting', route: 'settings', text: '设置', active: false, component: Settings}
];

const socket = SocketClient(`http://${initState.ip}:${initState.port}`);

const store = {
  menus,
  socket,
  extension: initState.extension
};

render(
  <ExtensionContext>
    <Routing {...store}/>
  </ExtensionContext>,
  document.getElementById('app')
);