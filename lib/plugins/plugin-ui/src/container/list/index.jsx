import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/seti.css';
import './less/index.less';

import 'whatwg-fetch';

import SearchBar from './search';
import Tools from './tools';
import Item from './item';
import constants from '../../constants';
import util from '../../util';

const initState = window.__initState__;
const { hostname, port } = location;

const classNameSpace = util.namespace('app__list');

class List extends React.Component {
  componentDidMount () {
    const { socket, dispatch, list, keys } = this.props;

    socket.on('ui/request', (proxy) => {
      const type = proxy.__from__ === 'url' ? constants.LIST_PUSH : constants.LIST_UPDATE;

      dispatch({
        type: 'EXTENSION_TEST_UPDATE'
      });


      dispatch({
        type,
        proxy
      });
    });
  }

  componentWillUnmount () {
    const { socket } = this.props;
    
    socket.off('ui/request');
  }

  shouldComponentUpdate (nextProps) {
    if (
      nextProps.list === this.props.list
    ) {
      return false;
    }

    return true;
  }

  onSubjectClick = (li) => {
    const { dispatch } = this.props;

    li.toggled = !li.toggled;

    dispatch({
      type: constants.LIST_TOGGLED,
      subject: li
    });
  }

  onToggled = (toggled) => {
    const { dispatch } = this.props;

    dispatch({
      type: constants.LIST_SEARCH_TOGGLED,
      toggled
    });
  };

  onPinClick = (li) => {
    const { dispatch, pinnedKeys } = this.props;

    const index = pinnedKeys.indexOf(li.subject);

    index > -1 ?
      pinnedKeys.splice(index, 1) : pinnedKeys.push(li.subject);

    fetch('/settings/list/pinned', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pinnedKeys
      })
    })
    .then(res => res.json())
    .then(res => dispatch({
      type: constants.LIST_PINNED,
      subject: li.subject
    }));
  };

  onSearch = (search) => {
    const { dispatch } = this.props;

    dispatch({
      type: constants.LIST_SEARCH,
      search
    });
  }

  itemRender (list, group) {
    const { match, location, dispatch } = this.props;

    return list.map((li, index) => {
      let url;
      const query = queryString.parse(location.search);

      query.overlay = 'visiable';
      query.group = group;
      query.id = index;
      url = `/list?${queryString.stringify(query)}`;

      const props = {
        id: index,
        code: li.code,
        message: li.message,
        url: li.url,
        ip: li.ip,
        method: li.method,
        path: li.path,
        extension: li.extension,
        requestHeaders: li.requestHeaders,
        responseHeaders: li.responseHeaders,
        route: url,
        group,
        match,
        location,
        dispatch
      };

      return (
        <Item {...props} key={index}/>
      );
    });
  }

  groupRender (list, keys) {
    const { search } = this.props;

    if (keys && keys.length > 0) {
      list = list.filter((li) => {
        return !(keys.indexOf(li.subject) > -1)
      });
    }

    const groupElement = list.map((li, index) => {
      let list;

      if (search.length > 0) {
        list = li.list.filter((li) => {
          const { url } = li;

          if (search.some((s) => {
            return url.indexOf(s) > -1;
          })) {
            return true;
          }
        });
      } else {
        list = li.list;
      }

      if (list.length === 0) {
        return null;
      }

      const itemElement = this.itemRender(list, index);
      const classes = classnames({
        [classNameSpace('item-group')]: true,
        [classNameSpace('item-group', 'invisible')]: !!li.toggled,
        [classNameSpace('item-group', 'pinned')]: !!li.pinned
      });

      const itemClass = classnames({
        [classNameSpace('item-group-subject-tools-item')]: true,
        [classNameSpace('item-group-subject-tools-item', 'selected')]: !!li.toggled
      });

      const itemPinClass = classnames({
        [classNameSpace('item-group-subject-tools-item')]: true,
        [classNameSpace('item-group-subject-tools-item', 'selected')]: !!li.pinned
      });

      return (
        <div className={classes} key={index}>
          <div className={classNameSpace('item-group-title')}>
            <div className={classNameSpace('item-group-subject')}>
              <img src={`/ico?url=${li.subject}`} alt={li.subject} className={classNameSpace('item-group-subject-ico')}/>
              <div className={classNameSpace('item-group-subject-text')}>
                {li.subject} 
                <div className={classNameSpace('item-group-subject-tools')}>
                  <div className={itemPinClass}>
                    <i className="ti-pin-alt" onClick={() => this.onPinClick(li)}></i>
                  </div>
                  <div className={itemClass}>
                    <i className="ti-split-v" onClick={() => this.onSubjectClick(li)}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          <div className={classNameSpace('item-group-content')}>
            {itemElement}
          </div>
        </div>
      );
    });

    return groupElement;
  }

  statusBarRender () {
    const { status } = this.props;
    const { keys } = status;

    return keys.map((key) => {
      const li = status[key];
      const value = Array.isArray(li.value) ? li.value.length : li.value;

      return (
        <div className={classnames({
          [classNameSpace('status-item')]: true,
          [classNameSpace(`status-${key}`)]: true
        })}>
          <i className={li.icon}></i>
          <span className={classNameSpace('status-value')}>
            {value}
          </span>
        </div>
      );
    });
  }

  render () {
    const { search, location, list, pinnedList, pinnedKeys, tools, status, dispatch } = this.props;
    const qs = queryString.parse(location.search);
    const classes = classnames({
      [classNameSpace('toolbar')]: true,
      [classNameSpace('toolbar', 'toggled')]: !!qs.tool
    });

    return (
      <div className={classNameSpace()}>
        <div className={classes}>
          <SearchBar value={search.join(' ')} onToggled={this.onToggled} onSearch={this.onSearch} location={location} />
          <Tools tools={tools} dispatch={dispatch} />
        </div>

        <div className={classNameSpace('view')}>
          {this.groupRender(pinnedList)}
          {this.groupRender(list, pinnedKeys)}
        </div>
        <div className={classNameSpace('status')}>
          {this.statusBarRender()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list, socket } = state;
  const { subjects, keys, pinnedSubjects, pinnedKeys, tools, table, status, search } = list;

  let pinnedList = [];

  if (Object.keys(pinnedSubjects).length > 0) {
    const pins = pinnedKeys.map((name) => {
      return pinnedSubjects[name];
    }).filter(res => res);

    if (pins.length > 0) {
      pinnedList = pins.sort((a, b) => a.position > b.position);
    }
  }

  console.log(pinnedList);

  return {
    tools: tools,
    list: subjects,
    pinnedKeys,
    pinnedList,
    search,
    keys,
    socket,
    status
  };
}

export default withRouter(connect(mapStateToProps)(List));