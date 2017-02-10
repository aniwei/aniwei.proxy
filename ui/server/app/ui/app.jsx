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

const { Navigator, Scene, Proxy, Specifics, Sidebar, Setting, Components, Modal, Header } = components;


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
    const { components } = this.props
    let route;

    route = Object.keys(components).map((m, i) => {
      return <Route path={m} component={components[m]} key={i}/>
    });

    return (
      <Router history={hashHistory}>
        <Route path="/proxy" component={App}>
          <Route path="specifics" component={Specifics} />
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