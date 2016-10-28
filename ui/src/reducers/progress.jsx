import type from '../constants'

export function progressDisplay (state = false, action) {
  switch (action.type) {
    case type.PROGRESS_DISPLAY:
        return action.display
      break;
    default:
      return state;
  }
}
