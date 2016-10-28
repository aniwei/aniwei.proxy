import type from '../constants'

export function navigationItem (state = 0, action) {
  switch (action.type) {
    case type.NAVIGATION_ITEM:
        return action.navigationItem
      break;
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
