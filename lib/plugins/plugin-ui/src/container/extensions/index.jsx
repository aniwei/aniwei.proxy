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
        delete query.extension;
        url = `/extensions?${queryString.stringify(query)}`;
      } else {
        query.extension = ext.name;
        url = `/extensions?${queryString.stringify(query)}`;
      }

      const props = {
        location,
        description: ext.description,
        name: ext.name,
        component: ext.component,
        route: url
      };

      return (
        <Item {...props} key={index}/>
      );
    });
  }

  render () {
    return (
      <div className="app__extension">

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