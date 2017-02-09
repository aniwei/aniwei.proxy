import { combineReducers } from 'redux';
import navigator from './navigator';
import scene from './scene';
import proxy from './proxy';
import socket from './socket';
import components from './components';

export default combineReducers({
  navigator,
  scene,
  proxy,
  socket,
  components
});
