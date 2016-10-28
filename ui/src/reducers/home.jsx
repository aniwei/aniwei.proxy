import type from '../constants'
import { clone } from 'lodash'

export function home (state = {}, action) {
  switch (action.type) {
    case type.HOME:
      return action.home
    case type.HOME_ITEM:
      state = clone(state, true);
      state.drawer = action.drawer;
      return state;
    case type.HOME_SOCKET:
      state = clone(state, true);
      state.socket = action.socket;
      return state;
    default:
      return state;
  }
}
