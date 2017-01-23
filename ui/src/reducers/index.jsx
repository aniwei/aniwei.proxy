import { combineReducers } from 'redux';

import { navigationItem, navigation } from './navigation';

import { home } from './home'
import { socket } from './socket'
import { plugin, pluginItem } from './plugin'
import { proxy } from './proxy'

export default combineReducers({
  navigationItem,
  navigation,
  pluginItem,
  home,
  socket,
  proxy,
  plugin
})
