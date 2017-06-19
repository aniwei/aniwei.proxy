import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/seti.css';
import './less/index.less';

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

      // if (Array.isArray(proxy)) {
      //   return proxy.forEach((pr) => {
      //     if (
      //       pr.hostname === initState.ip ||
      //       pr.hostname === hostname ||
      //       pr.hostname === '127.0.01'
      //     ) {
      //       return this;
      //     }

      //     dispatch({
      //       type,
      //       proxy: pr
      //     });
      //   });
      // }

      // if (
      //   proxy.hostname === initState.ip ||
      //   proxy.hostname === hostname ||
      //   proxy.hostname === '127.0.01'
      // ) {
      //   return this;
      // }
      dispatch({
        type: 'EXTENSION_TEST_UPDATE'
      });


      dispatch({
        type,
        proxy
      });
    });
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

  onSearch = (value) => {
    const { dispatch } = this.porps;

    dispatch({
      type: constants.LIST_ONSEARCH,
      value
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

  groupRender () {
    const { list } = this.props;

    const groupElement = list.map((li, index) => {
      const itemElement = this.itemRender(li.list, index);
      const classes = classnames({
        [classNameSpace('item-group')]: true,
        [classNameSpace('item-group', 'invisible')]: !!li.toggled
      });

      return (
        <div className={classes} key={index}>
          <div className={classNameSpace('item-group-title')}>
            <div className={classNameSpace('item-group-subject')}>
              {li.subject} 
              {/*<span className={classNameSpace('item-group-number')}>{li.list.length}</span>*/}

              <i className="iconfont icon-more-fill app__list-item-group-subject-icon" onClick={() => this.onSubjectClick(li)}></i>
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

  render () {
    const { search, location } = this.props;
    const qs = queryString.parse(location.search);
    const classes = classnames({
      [classNameSpace('toolbar')]: true,
      [classNameSpace('toolbar', 'toggled')]: !!qs.tool
    });

    return (
      <div className={classNameSpace()}>
        <div className={classes}>
          <SearchBar {...search} onToggled={this.onToggled} onSearch={this.onSearch} location={location}/>
          <Tools />
        </div>

        <div className={classNameSpace('view')}>
          {this.groupRender()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list, socket } = state;
  const { subjects, keys, search } = list;

  return {
    list: subjects,
    keys,
    socket,
    search
  };
}

export default withRouter(connect(mapStateToProps)(List));