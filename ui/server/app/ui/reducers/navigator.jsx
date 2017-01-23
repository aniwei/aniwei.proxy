import actionType from '../constants'
import { clone } from 'lodash' 

export default function navigator (state = {}, action) {
  state = clone(state, true);

  switch (action.type) {
    case actionType.NAVIGATOR_ITEM_TAP:
      state.current = action.current;
      break;
  }
  
  return state;
}