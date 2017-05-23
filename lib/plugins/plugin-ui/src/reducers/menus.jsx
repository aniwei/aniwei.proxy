import { clone } from 'lodash';

import constants from '../constants';

export default function tools (state = [], action) {
  switch (action.type) {
    case constants.TOOL_ACTIVE:
      return clone(state);
    default:
      return state;
  }
}