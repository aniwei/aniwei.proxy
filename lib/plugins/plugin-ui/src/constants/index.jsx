const constants = {};

const actionConstants = (action) => {
  constants[action] = action;
};

export default constants;

// actions create
actionConstants('TOOL_ACTIVE');
actionConstants('TAB_PUSH');
actionConstants('TAB_CLOSE');

actionConstants('SOCKET_CONNECT');

// list
actionConstants('LIST_PUSH');
actionConstants('LIST_UPDATE');
actionConstants('LIST_TOGGLED');
actionConstants('LIST_OVERLAYED');
actionConstants('LIST_SEARCH_TOGGLED');

// 
