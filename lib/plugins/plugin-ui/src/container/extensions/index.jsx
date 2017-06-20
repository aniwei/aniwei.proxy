import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import './less/index.less';

import SearchBar from './search';
import Item from './item';

class Extensions extends React.Component {
  extensionRender () {
    const { match, location, list } = this.props;

    return list.map((ext, index) => {
      let url;
      const query = queryString.parse(location.search);

      if (query.id - 0 === index) {
        delete query.id;
        url = `/list?${queryString.stringify(query)}`;
      } else {
        query.id = index;
        url = `/list?${queryString.stringify(query)}`;
      }

      const props = {
        description: ext.description,
        name: ext.name,
        route: ''
      };

      return (
        <Item {...props} key={index}/>
      );
    });
  }

  render () {
    return (
      <div className="app__extension">
        <div className="app__extension-toolbar">
          <SearchBar />
        </div>

        <div className="app__extension-view">
          {this.extensionRender()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { extension } = state;

  return {
    list: extension
  };
}

export default withRouter(connect(mapStateToProps)(Extensions));