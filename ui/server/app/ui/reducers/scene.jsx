import actionType from '../constants'
import { clone } from 'lodash' 

export default function navigator (state = {}, action) {
  state = clone(state, true);

  switch (action.type) {
    case actionType.SCENE_ACTIVE:
      state.active = action.active;
      break;

    case actionType.PLUGIN_ACTIVE:
      state.plugin.current = action.current;
      break;
  }
  
  return state;
}