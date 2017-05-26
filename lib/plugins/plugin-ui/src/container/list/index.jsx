import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import './less/index.less';

import SearchBar from './search';
import Item from './item';
import constants from '../../constants';

class List extends React.Component {
  componentDidMount () {
    const { socket, dispatch, list, keys } = this.props;

    socket.on('ui/request', (proxy) => {
      const type = proxy.id in keys ? constants.LIST_UPDATE : constants.LIST_PUSH;

      dispatch({
        type,
        proxy
      });
    });
  }

  itemRender (list, group) {
    const { match, location } = this.props;

    return list.map((li, index) => {
      let url;
      const query = queryString.parse(location.search);

      if (query.group - 0 === group && query.id - 0 === index) {
        delete query.id;
        delete query.group;
        url = `/list?${queryString.stringify(query)}`;
      } else {
        query.group = group;
        query.id = index;
        url = `/list?${queryString.stringify(query)}`;
      }

      const props = {
        code: li.code,
        url: li.url,
        ip: li.ip,
        method: li.method,
        path: li.path,
        route: url,
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

      return (
        <div className="app__list-item-group" key={index}>
          <div className="app__list-item-group-title">
            <div className="app__list-item-group-subject">
              {li.subject}
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
    return (
      <div className="app__list">
        <div className="app__list-toolbar">
          <SearchBar />
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
  const { subjects, keys } = list;

  console.log(subjects);

  return {
    list: subjects,
    keys,
    socket
  };
}

export default withRouter(connect(mapStateToProps)(List));