import actionType from '../constants'
import { clone } from 'lodash' 

export default function navigator (state = {}, action) {
  state = clone(state, true);
  
  return state;
}