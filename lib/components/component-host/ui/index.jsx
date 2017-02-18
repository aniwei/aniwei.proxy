import React, { createElement, PropTypes } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Router, Route, Link, hashHistory, IndexRoute, withRouter } from 'react-router';

import './css/index.css';

class Host extends React.Component {
  render () {
    return (
      <div className="app__host">
        
      </div>
    );
  }
}

export default Host;
