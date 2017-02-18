import React, { createElement, PropTypes } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Router, Route, Link, hashHistory, IndexRoute, withRouter } from 'react-router'

import io from 'socket.io-client';
import 'whatwg-fetch';

import './common/iconfont/index.css';
import './common/reset/index.css';
import './common/weui/index.css';
import './index.css';

import components from './components'
import reducers from './reducers';
import type from './constants';
import Socket from './common/socket';
import Classes from './classes';

const { 
  Navigator, 
  Scene, 
  Proxy, 
  Specifics, 
  Sidebar, 
  Setting, 
  Components, 
  Modal, 
  Header 
} = components;


class App extends React.Component {
  static childContextTypes = {
    Socket: PropTypes.func
  }

  getChildContext () {
    return {
      Socket: Socket
    }
  }

  render () {
    const { location } = this.props;
    let name = location.pathname.slice(1),
        element;

    if (name.indexOf('proxy') === -1) {
      element = this.props.children;
    }

    return (
      <div className="view__app">
        <Navigator />
        <Scene>
          <Sidebar>{element}</Sidebar>
          <Proxy>
            {this.props.children}
          </Proxy>
        </Scene>
      </div>
    );
  }
}

App = withRouter(App);

class AppRouter extends React.Component {
  render () {
    const { components } = this.props
    let route;

    route = Object.keys(components).filter((m) => {
      const { brief } = components[m];

      if (brief) {
        if (brief.uri) {
          return true;
        }
      }
    }).map((m, i) => {
      const { brief } = components[m];

      return <Route path={m} component={Classes[brief.className]} key={i} />;
    });

    return (
      <Router history={hashHistory}>
        <Route path="/proxy" component={App}>
          <Route path="specifics/:id" component={Specifics} />
        </Route>
        <Route path="/" component={App}>
          <Route path="components" component={Components}>
            {route}
          </Route>
          <Route path="config" component={Setting}/>
          <Route path="header" component={Header}/>
        </Route>
      </Router>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components
  }
}

export default connect(mapStateToProps)(AppRouter);