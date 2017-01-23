import React, { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { Msg } from 'react-weui';


import 'whatwg-fetch';

import * as actions from '../../actions';
import constants from '../../constants';


const getComponent = (path) => (param, header) => {
  let query = '';
  
  if (typeof param == 'object') {
    query = Object.keys(param).map((k) => {
      let value = param[k] || '';

      return `${k}=${value}`;
    }).join('&') || '';

    if (query) {
      query = '?' + query;
    }
  }

  return fetch(`/${path}${query}`, header || {});
}

class Container extends React.Component {
  render () {
    const { location, children, connection } = this.props;
    const { query, pathname } = location;
    let element,
        path = pathname.slice(1);

    if (children) {
      element = React.cloneElement(children, {
        actions: actions,
        constants: constants,
        fetch: getComponent(path),
        connection: connection
      });
    }

    return (
      <div className="app__midway">
        <div className="app__midway-title">
          {query.title}
          <Link to="/midway">
            <i className="iconfont icon-close app__midway-close"></i>
          </Link>
        </div>
        {element}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    connection: state.socket.connection
  }
}

export default connect(mapStateToProps)(withRouter(Container));