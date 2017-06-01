import React from 'react';
import classnames from 'classnames';
import { Route, withRouter, BrowserRouter, HashRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteTransition } from 'react-router-transition';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Scroll from 'react-iscroll';
import iScroll from 'iscroll';


// 公共样式
import '../../components/common';
import './less/index.less';

import Navigator from '../../components/navigator';
import List from '../list';
import Extensions from '../extensions';
import Welcome from '../welcome';

import actions from '../../actions';


class App extends React.Component {

  render () {
    const { props } = this;
    
    return (
      <HashRouter>
        <Route render={({ location }) => (
          <div className="app">
            <Navigator 
              className="app__navigator"
              menus={props.menus}
            />
            <Scroll iScroll={iScroll} options={{ mouseWheel: true, click: true }}>
              <div ref="scene" className="app__scene">
                <Route path="/" component={Welcome} />
                <Route path="/list" component={List} />
                <Route path="/extensions" component={Extensions} />
              </div>
            </Scroll>
          </div>  
        )} />
      </HashRouter>
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