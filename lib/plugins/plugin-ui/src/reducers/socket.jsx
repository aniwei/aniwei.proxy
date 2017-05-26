import { assign } from 'lodash';

import constants from '../constants';

export default function socket (state = null, action) {
  switch (action.type) {
    case constants.SOCKET_CONNECT:
      return assign(state, {
        socket: action.socket
      });
    default:
      return state;
  }
}