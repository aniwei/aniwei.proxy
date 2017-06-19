import { clone } from 'lodash';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';


import constants from '../constants';
import menus from './menus';
import tabs from './tabs';
import list from './list';
import socket from './socket';
import extension from './extension';

export default combineReducers({
  menus,
  tabs,
  list,
  socket,
  extension,
  routing: routerReducer
});