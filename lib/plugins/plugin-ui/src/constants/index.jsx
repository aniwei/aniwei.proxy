const constants = {};

const actionConstants = (action) => {
  constants[action] = action;
};

export default constants;

// actions create
actionConstants('TOOL_ACTIVE');
actionConstants('TAB_PUSH');
actionConstants('TAB_CLOSE');
