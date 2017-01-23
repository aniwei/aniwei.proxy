import type from '../constants'
import { clone } from 'lodash'

export function home (state = {}, action) {
  state = clone(state, true);

  switch (action.type) {
    case type.HOME:
      break;
    case type.HOME_ITEM:
      state.drawer = action.drawer;
      break
    case type.HOME_SOCKET:
      state.socket = action.socket;
      break;
    case type.SIDEBAR_ACTIVE:
      state.active = action.active;
      break;
  }

  return state;
}
