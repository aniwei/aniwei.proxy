import type from '../constants'
import { clone } from 'lodash'

export function proxy (state = {}, action) {
  switch (action.type) {
    case type.PROXY:
      return state
    default:
      return state;
  }
}
