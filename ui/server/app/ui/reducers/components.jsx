import actionType from '../constants'
import { clone } from 'lodash' 

export default function components (state = {}, action) {
  const keys = Object.keys(state);
  const map = {};

  state = clone(state, true);

  keys.forEach((k) => {
    const cmp = state[k];
    const brief = cmp.brief;

    if (brief.ui) {
      map[k] = cmp;
    }
  });
  
  return map;
}