import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import './less/index.less';

import SearchBar from './search';
import Tools from './tools';
import Item from './item';
import constants from '../../constants';

const initState = window.__initState__;
const { hostname, port } = location;

class List extends React.Component {

  componentDidMount () {
    const { socket, dispatch, list, keys } = this.props;

    socket.on('ui/request', (proxy) => {
      const type = proxy.__from__ === 'url' ? constants.LIST_PUSH : constants.LIST_UPDATE;

      if (
        proxy.hostname === initState.ip ||
        proxy.hostname === hostname ||
        proxy.hostname === '127.0.01'
      ) {
        return this;
      }

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
    const { match, location } = this.props;

    return list.map((li, index) => {
      let url;
      const query = queryString.parse(location.search);
      const isCurrentUrl = query.group - 0 === group && query.id - 0 === index

      if (isCurrentUrl) {
        delete query.id;
        delete query.group;
        url = `/list?${queryString.stringify(query)}`;
      } else {
        query.group = group;
        query.id = index;
        url = `/list?${queryString.stringify(query)}`;
      }

      const props = {
        overlayed: isCurrentUrl && query.overlay,
        code: li.code,
        message: li.message,
        url: li.url,
        ip: li.ip,
        method: li.method,
        path: li.path,
        route: url,
        headers: li.headers,
        group,
        match,
        location,
        id: index
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
        ['app__list-item-group']: true,
        ['app__list-item-group_invisible']: !!li.toggled
      });

      return (
        <div className={classes} key={index}>
          <div className="app__list-item-group-title">
            <div className="app__list-item-group-subject">
              {li.subject} 
              <span className="app__list-item-group-number">{li.list.length}</span>
              <i className="iconfont icon-down app__list-item-group-subject-icon" onClick={() => this.onSubjectClick(li)}></i>
            </div>
          </div>
         
          <div className="app__list-item-group-content">
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
      ['app__list-toolbar']: true,
      ['app__list-toolbar_toggled']: !!qs.tool
    });

    return (
      <div className="app__list">
        <div className={classes}>
          <SearchBar {...search} onToggled={this.onToggled} onSearch={this.onSearch} location={location}/>
          <Tools />
        </div>

        <div className="app__list-view">
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