import React, { createElement } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Router, Route, Link, hashHistory, IndexRoute, withRouter } from 'react-router'

import 'whatwg-fetch';
import './index.css';
import './common/iconfont/index.css';
import './common/reset/index.css';
import './common/weui/index.css';

import components from './components'
import reducers from './reducers';
import io from 'socket.io-client';

import type from './constants';

const { Navigator, Scene, Proxy, Sidebar, Setting, Midway, Modal, Header } = components;


class App extends React.Component {
  render () {
    const { location } = this.props;
    let name = location.pathname.slice(1),
        element;

    if (name.indexOf('header') > -1) {
      element = <Sidebar><Header /></Sidebar>
    }

    return (
      <div className="view__app">
        <Navigator />
        <Scene>
          <Sidebar>{this.props.children}</Sidebar>
          {element}
          <Proxy/>
        </Scene>
      </div>
    );
  }
}

App = withRouter(App);


class AppRouter extends React.Component {
  render () {
    const { midway } = this.props
    let route;

    route = Object.keys(midway).map((m) => {
      return <Route path={m} component={midway[m]}/>
    });

    return (
      <Router history={hashHistory}>
        <Route path="/proxy" component={App}/>
        <Route path="/" component={App}>
          <Route path="midway" component={Midway}>
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
    midway: state.midway
  }
}

export default connect(mapStateToProps)(AppRouter);