import { clone } from 'lodash';

import constants from '../constants';

export default function tabs (state = [], action) {
  switch (action.type) {
    case constants.TAB_PUSH:
      state.push(action.tool);

      return clone(state);
    case constants.TAB_CLOSE:
      state.splice(state.indexOf(action.tool), 1);

      return clone(state);
    default:
      return state;
  }
}