import { combineReducers } from 'redux';
import navigator from './navigator';
import scene from './scene';
import proxy from './proxy';
import socket from './socket';
import midway from './midway';

export default combineReducers({
  navigator,
  scene,
  proxy,
  socket,
  midway
});
