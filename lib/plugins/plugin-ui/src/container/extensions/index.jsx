import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import './less/index.less';

import SearchBar from './search';
import Item from './item';

class Extensions extends React.Component {
  static contextTypes = {
    extension: React.PropTypes.object
  };

  extensionRender () {
    const { match, location, list, dispatch } = this.props;
    const { components } = this.context.extension;

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

      let component;

      components.some((ex) => {
        if (ex.name === ext.name) {
          component = ex.component;
        }
      });

      const props = {
        dispatch,
        location,
        description: ext.description,
        name: ext.name,
        component,
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