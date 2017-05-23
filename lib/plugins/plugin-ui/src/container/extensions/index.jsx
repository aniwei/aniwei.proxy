import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import './less/index.less';

import SearchBar from './search';
import Item from './item';

class Extensions extends React.Component {
  extensionRender (list, group) {
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
      const itemElement = this.extensionRender(li.list, index);

      return (
        <div className="app__extension-item-group" key={index}>
          <div className="app__extension-item-group-title">
            <div className="app__extension-item-group-subject">
              {li.subject}
            </div>
          </div>
         
          <div className="app__extension-item-group-content">
            {itemElement}
          </div>
        </div>
      );
    });

    return groupElement;
  }

  render () {
    return (
      <div className="app__extension">
        <div className="app__extension-toolbar">
          <SearchBar />
        </div>

        <div className="app__extension-view">
          {this.groupRender()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list } = state;

  return {
    list
  };
}

export default withRouter(connect(mapStateToProps)(Extensions));