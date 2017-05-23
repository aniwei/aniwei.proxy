import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import List from './container/list';
import Extensions from './container/extensions';
import Settings from './container/settings';

import Routing from './routing';

// data
import list from './data/list.json';

const menus = [
  {key: 'message', route: 'list', text: '请求数据', active: false, component: List},
  {key: 'app', route: 'extensions', text: '设置', active: false, component: Extensions},
  {key: 'setting', route: 'settings', text: '设置', active: false, component: Settings}  
];

const store = {
  menus,
  list
};


render(
  <Routing {...store}/>,
  document.getElementById('app')
);