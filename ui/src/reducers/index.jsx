import { combineReducers } from 'redux';

import { navigationItem, navigation } from './navigation';

import { home } from './home'
import { socket } from './socket'
import { about } from './about'
import { progressDisplay } from './progress'
import { explore } from './explore'

export default combineReducers({
  navigationItem,
  navigation,
  progressDisplay,
  explore,
  home,
  socket,
  about
})
