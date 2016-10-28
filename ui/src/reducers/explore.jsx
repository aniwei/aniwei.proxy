import type from '../constants'
import { clone } from 'lodash'

export function explore (state = {}, action) {
  switch (action.type) {
    case type.EXPLORE:
        return action.about
    case type.EXPLORE_MIDDWAY_ITEM:
      state = clone(state, true);
      state.drawer = action.drawer;

      return state;
    default:
      return state;
  }
}
