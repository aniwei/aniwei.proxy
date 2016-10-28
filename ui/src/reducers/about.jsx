import type from '../constants'
import { clone } from 'lodash'

export function about (state = {}, action) {
  switch (action.type) {
    case type.ABOUT:
        return action.ABOUT
    case type.ABOUT_MORE_MENU_ITEM:
      state = clone(state, true);
      state.drawer = action.drawer;

      return state;
    default:
      return state;
  }
}
