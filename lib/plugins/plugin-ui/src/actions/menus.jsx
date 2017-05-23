import constants from '../constants';

export function toolSelect (tool) {
  return {
    type: constants.TOOL_SELECT,
    tool
  };
}