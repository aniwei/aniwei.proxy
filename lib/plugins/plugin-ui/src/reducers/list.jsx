import { assign, clone } from 'lodash';

import constants from '../constants';

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
  ]
}

const reducers = {
  [constants.LIST_SEARCH_TOGGLED]: (state, action) => {
    const { search } = state;

    search.toggled = !action.toggled;

    return clone(state);
  },

  [constants.LIST_TOGGLED]: (state, action) => {
    const { keys, table, subjectKeys, subjects } = state;
    const { subject } = action.subject;
    const ref = subjectKeys[subject];

    if (typeof ref === 'number') {
      assign(subjects[ref], subject);
    }

    return clone(state);
  },

  [constants.LIST_PUSH]: (state, action) => {
    const { keys, table, subjectKeys, subjects } = state;
    const { id, hostname, path, url, method, protocol, port, headers } = action.proxy;

    const newProxy = {
      id,
      headers,
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

    return clone(state);
  },

  [constants.LIST_UPDATE]: (state, action) => {
    const { keys, table } = state;
    const { id, ip } = action.proxy;

    const ref = table[keys[id]];

    if (ref) {
      assign(ref, action.proxy);
    }

    return clone(state);
  }
} 

export default function list (state = initState, action) {
  const reducer = reducers[action.type];

  return reducer ? reducer(state, action) : state;
}