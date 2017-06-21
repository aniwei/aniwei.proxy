import { clone } from 'lodash';

import constants from '../constants';

export default function layer (state = {}, action) {
  switch (action.type) {
    case constants.LAYER_OVERLAYED:
      return clone(state);
    default:
      return state;
  }
}