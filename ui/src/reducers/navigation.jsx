import type from '../constants'
import 'whatwg-fetch';


export function navigationItem (state = 0, action) {
  switch (action.type) {
    case type.NAVIGATION_ITEM:
      fetch(`/update?type=navigationItem&value=${action.navigationItem}`);
      return action.navigationItem
    default:
      return state;
  }
}

export function navigation (state = [], action) {
  switch (action.type) {
    case type.NAVIGATION:

        return action.navigation
      break;
    default:
      return state;
  }
}
