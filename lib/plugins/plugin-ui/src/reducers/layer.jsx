import { clone } from 'lodash';

import constants from '../constants';

export default function layer (state = {}, action) {
  switch (action.type) {
    case constants.LAYER_OVERLAYED:
      state.component = action.component;
      
      Object.keys(action).forEach((key) => {
        if (key === 'type') {
          return this;
        }

        state[key] = action[key];
      });

      return clone(state);
    default:
      return state;
  }
}