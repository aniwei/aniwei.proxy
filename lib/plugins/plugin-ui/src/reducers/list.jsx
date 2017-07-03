import { assign, clone, cloneDeep } from 'lodash';
import constants from '../constants';

const __initState__ = window.__initState__;
const initState = {
  keys: {},
  table: [],
  subjectKeys: {},
  subjects: [],
  search: {},
  tools: [
    {
      subject: '通用工具',
      list: [
        {
          key: '' 
        }
      ]
    }
  ],
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

const reducers = {
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

  [constants.LIST_PUSH]: (state, action) => {
    const { keys, table, subjectKeys, subjects } = state;

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
      
      const key = `${protocol}//${hostname}${port ? ':' + port : ''}`;

      let index = subjectKeys[key];

      if (index === undefined) {
        let ref = {
          subject: key,
          list: [newProxy]
        };

        subjectKeys[key] = subjects.length;
        subjects.push(ref);
      } else {
        subjects[index].list.push(newProxy);
      }
    });

    return cloneDeep(state);
  },

  [constants.LIST_UPDATE]: (state, action) => {
    const { keys, table } = state;
    const forEach = (proxy) => {
      const { id } = proxy;

      const ref = table[keys[id]];

      if (ref) {
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