import { clone } from 'lodash';

import constants from '../constants';

export default function layer (state = {}, action) {
  switch (action.type) {
    case constants.LAYER_OVERLAYED:
      state.component = action.component;
      
      if (action.data) {
        state.props = action.props;
      }

      return clone(state);
    default:
      return state;
  }
}