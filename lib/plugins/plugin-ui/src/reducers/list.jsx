import { assign, clone, cloneDeep } from 'lodash';
import constants from '../constants';

import 'whatwg-fetch';


const __initState__ = window.__initState__;
const initState = {
  status: {
    length: 0,
    http: [],
    https: [],
    domain: [],
    type: []
  },
  keys: {},
  table: [],
  subjectKeys: {},
  subjects: [],
  pinnedSubjects: {},
  pinnedKeys: __initState__.listSetting.pinnedKeys || [],
  search: [],
  tools: __initState__.listSetting.tools,
  // tools: {
  //   list: [
  //     {
  //       subject: '控制工具',
  //       list: [
  //         { key: 'on-off', icon: 'ti-control-record', action: 'LIST_RECORD' },
  //         { key: 'cache', icon: 'ti-server', action: 'LIST_CACHE_CTRL' },
  //       ]
  //     },
  //     {
  //       subject: '数据工具',
  //       list: [
  //         { key: 'clear', icon: 'ti-trash', action: 'LIST_ALL_CLEAR' },
  //         { key: 'fold', icon: 'ti-split-v', action: 'LIST_ALL_TOGGLED' },
  //         { key: 'save', icon: 'ti-save', action: 'LIST_ALL_SAVE', href: '/settings/list/export' }
  //       ]
  //     }
  //   ]
  // },
  overviewTabs: [
    { key: 'header', text: 'Header' },
    { key: 'preview', text: 'Preview' },
    // { key: 'response', text: 'Response' },
    // { key: 'cookies', text: 'Cookies' },
    // { key: 'timing', text: 'Timing' }
  ],
  overviewData: null
}

let others = [];

const sycnTools = (tools) => {
  fetch('/settings/list/tools', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tools
    })
  });
}

const reducers = {
  [constants.LIST_SEARCH]: (state, action) => {
    state.search = action.search;

    return cloneDeep(state);
  },

  [constants.LIST_RECORD]: (state, action) => {
    const { tools } = state;
    const record = !tools.record;

    tools.record = record;
    action.tool.selected = record;

    sycnTools(tools);

    return cloneDeep(state);
  },

  [constants.LIST_CACHE_CTRL]: (state, action) => {
    const { tools } = state;
    const disableCache = !tools.disableCache;

    tools.disableCache = disableCache;
    action.tool.selected = disableCache;

    sycnTools(tools);

    return cloneDeep(state);
  },

  [constants.LIST_ALL_CLEAR]: (state, action) => {
    assign(state, {
      keys: {},
      table: [],
      subjectKeys: {},
      subjects: [],
      pinnedSubjects: {},
      status: {
        length: 0,
        https: [],
        http: [],
        domain: [],
        type: []
      }
    });

    fetch('/settings/list/clear');

    return cloneDeep(state);
  },

  [constants.LIST_ALL_TOGGLED]: (state, action) => {
    const { subjects, tools } = state;
    const toggled = !action.tool.selected;

    subjects.forEach(subject => subject.toggled = toggled);

    action.tool.selected = toggled;

    tools.toggled = toggled;

    sycnTools(tools);

    return cloneDeep(state);
  },

  [constants.LIST_OVERLAYED]: (state, action) => {
    state.overviewData = action.overviewData;

    return clone(state);
  },

  [constants.LIST_SEARCH_TOGGLED]: (state, action) => {
    const { search } = state;

    search.toggled = !action.toggled;
    

    return cloneDeep(state);
  },

  [constants.LIST_TOGGLED]: (state, action) => {
    const { keys, table, subjectKeys, subjects } = state;
    const { subject } = action.subject;
    const ref = subjectKeys[subject];

    if (typeof ref === 'number') {
      assign(subjects[ref], subject);
    }

    return cloneDeep(state);
  },

  [constants.LIST_PINNED]: (state, action) => {
    const { keys, table, subjectKeys, subjects, pinnedSubjects, pinnedKeys } = state;
    const { subject } = action;
    const key = subjectKeys[subject];

    if (typeof key === 'number') {
      const object = subjects[key];
      const index = pinnedKeys.indexOf(subject);

      if (index > -1) {
        object.pinned = true;
        pinnedSubjects[subject] = object;
      } else {
        object.pinned = false;
        delete pinnedSubjects[subject];
      }

      assign(object, action.subject);
    }

    return cloneDeep(state);
  },

  [constants.LIST_PUSH]: (state, action) => {
    const { keys, table, subjectKeys, subjects, pinnedKeys, pinnedSubjects, tools, status } = state;

    action.proxy.list.forEach((proxy) => {
      const { id, hostname, path, url, method, protocol, port, requestHeaders } = proxy;

      if (
        proxy.hostname === __initState__.ip ||
        proxy.hostname === __initState__.hostname ||
        proxy.hostname === location.hostname ||
        proxy.hostname === '127.0.0.1' && (proxy.port - 0) === __initState__.port
      ) {
        return this;
      }

      const newProxy = {
        id,
        requestHeaders,
        method,
        path,
        url
      }

      keys[id] = table.length;
      table.push(newProxy);

      status.length = table.length;
      protocol === 'http:' || protocol === 'http' ?
        status.http.push(key) : status.https.push(key);

      const key = `${protocol}//${hostname}${port ? ':' + port : ''}`;

      let index = subjectKeys[key];
      const pinned = pinnedKeys.indexOf(key) > -1;

      if (index === undefined) {
        let ref = {
          subject: key,
          list: [newProxy],
          pinned
        };

        if (pinned) {
          pinnedSubjects[key] = ref;
        }

        if (tools.toggled) {
          ref.toggled = true;
        }

        subjectKeys[key] = subjects.length;
        subjects.push(ref);
      } else {
        if (pinned) {
          pinnedSubjects[key] = subjects[index];
        }

        if (tools.toggled) {
          subjects[index].toggled = true;
        }

        subjects[index].list.push(newProxy);
      }

      status.domain = Object.keys(subjectKeys || {});
    });

    return cloneDeep(state);
  },

  [constants.LIST_UPDATE]: (state, action) => {
    const { keys, table, pinnedKeys, pinnedSubjects, tools, status } = state;
    const forEach = (proxy) => {
      const { id } = proxy;
      const ref = table[keys[id]];

      if (ref) {
        const subject = ref.subject;

        if (tools.toggled) {
          ref.toggled = true;
        }

        if (pinnedKeys.indexOf(subject) > -1) {
          ref.pinned = true;

          pinnedSubjects[subject] = ref;
        }

        if (proxy.type) {
          if (status.type.indexOf(proxy.type) === -1) {
            status.type.push(proxy.type);
          }
        }

        assign(ref, proxy);
      } else {
        others.push(proxy);
      }
    };    

    const list = others.slice();

    others = [];

    list.forEach(forEach);
    action.proxy.list.forEach(forEach);

    return cloneDeep(state);
  }
} 

export default function list (state = initState, action) {
  const reducer = reducers[action.type];

  return reducer ? reducer(state, action) : state;
}