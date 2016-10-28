import type from '../constants'
import { clone } from 'lodash'

export function socket (state = {}, action) {
  switch (action.type) {
    case type.SOCKET:
      return action.socket;
    default:
      return state;
  }
}
