import constants from '../constants';

export function tabPush (tool) {
  return {
    type: constants.TAB_PUSH,
    tool
  };
}

export function tabClose (tool) {
  return {
    type: constants.TAB_CLOSE,
    tool
  }
}