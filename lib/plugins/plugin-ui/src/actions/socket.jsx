import constants from '../constants';

export function socketConnect (socket) {
  return {
    type: constants.SOCKET_CONNECT,
    socket
  };
}