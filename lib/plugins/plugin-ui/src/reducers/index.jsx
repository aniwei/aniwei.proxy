import { clone } from 'lodash';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'


import constants from '../constants';
import menus from './menus';
import tabs from './tabs';
import list from './list';

export default combineReducers({
  menus,
  tabs,
  list,
  routing: routerReducer
});