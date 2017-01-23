import type from '../constants'
import { clone } from 'lodash'
import 'whatwg-fetch';

export function plugin (state = {}, action) {
  state = clone(state, true);

  switch (action.type) {
    case type.PLUGIN_UPDATE:
        state.item = action.plugin;
        return state;
      break;
    case type.PLUGIN_SELECTED:
        state.current = action.plugin;
        return state;
    default:
      return state;
  }
}

export function pluginItem (state = {}, action) {
  switch (action.type) {
    case type.PLUGIN_TYPE:
      fetch(`/update?type=pluginItem&value=${JSON.stringify(action.plugin)}`);
      return action.plugin;
    default: 
      return state;
  }
} 
