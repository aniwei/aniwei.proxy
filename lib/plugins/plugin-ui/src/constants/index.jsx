const constants = {};

const actionConstants = (action) => {
  constants[action] = action;
};

export default constants;

constants.actionConstants = actionConstants;

// actions create
actionConstants('TOOL_ACTIVE');
actionConstants('TAB_PUSH');
actionConstants('TAB_CLOSE');

actionConstants('SOCKET_CONNECT');

// list
actionConstants('LIST_PUSH');
actionConstants('LIST_UPDATE');
actionConstants('LIST_TOGGLED');
actionConstants('LIST_PINNED');
actionConstants('LIST_OVERLAYED');
actionConstants('LIST_SEARCH_TOGGLED');
actionConstants('LIST_SEARCH');
actionConstants('LIST_PREVIEW_UPDATE');
actionConstants('LIST_ALL_CLEAR');
actionConstants('LIST_ALL_TOGGLED');
actionConstants('LIST_ALL_SAVE');
actionConstants('LIST_CACHE_CTRL');
actionConstants('LIST_RECORD');
actionConstants('LIST_SYNC');

// layer
actionConstants('LAYER_OVERLAYED');
