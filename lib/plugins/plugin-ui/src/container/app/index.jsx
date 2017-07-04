import React, { createElement } from 'react';
import classnames from 'classnames';
import { Route, withRouter, BrowserRouter, HashRouter, StaticRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteTransition } from 'react-router-transition';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import queryString from 'query-string';

// 公共样式
// import './less/index.less';
import 'whatwg-fetch';

import Navigator from '../../components/navigator';
import Overview from '../overview';
import List from '../list';
import Extensions from '../extensions';
import ExtensionsView from '../extension-view';
import Welcome from '../welcome';
import Layer from '../layer';

import actions from '../../actions';


class App extends React.Component {
  onWindowHashChange = () => {

    fetch(`/last-step?url=${encodeURIComponent(location.href)}`);
  }

  componentDidMount () {
    window.addEventListener('hashchange', this.onWindowHashChange, false);
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.onWindowHashChange, false);
  }

  render () {
    const { props } = this;
    
    return (
        <div className="app">
          <Navigator 
            className="app__navigator"
            menus={props.menus}
          />
        </div>  
    );
  }
}

export default connect((state, ownProps) => {
  const { menus, list } = state;

  return {
    menus,
    list
  };
}, (dispatch) => {
  return bindActionCreators({
    onSelect: actions.tabPush,
    onClose: actions.tabClose
  }, dispatch);
})(App);
