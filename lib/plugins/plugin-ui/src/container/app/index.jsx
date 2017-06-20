import React from 'react';
import classnames from 'classnames';
import { Route, withRouter, BrowserRouter, HashRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteTransition } from 'react-router-transition';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Scroll from 'react-iscroll';
import iScroll from 'iscroll';
import queryString from 'query-string';


// 公共样式
import '../../components/common';
import './less/index.less';

import Navigator from '../../components/navigator';
import Overview from '../overview';
import List from '../list';
import Extensions from '../extensions';
import ExtensionsView from '../extension-view';
import Welcome from '../welcome';

import actions from '../../actions';


class App extends React.Component {

  scrollerRefresh = () => {
    const iscroll = this.refs.iscroll;

    clearTimeout(this.scrollerTimer);

    this.scrollerTimer = setTimeout(() => {
      if (iscroll) {
        iscroll.refresh();
      }
    }, 600);
  }

  componentDidMount () {
    const getSearch = (url) => {
      let i = url.indexOf('#');

      url = url.slice(i);

      i = url.indexOf('?');

      return url.slice(i);
    }

    const delayRefresh = (evt) => {
      const { newURL, oldURL } = evt;
      const newQS = queryString.parse(getSearch(newURL));
      const oldQS = queryString.parse(getSearch(oldURL));

      if (
        !(newQS.group === oldQS.group) ||
        !(newQS.id === oldQS.id) ||
        !(newQS.overviewClosed === oldQS.overviewClosed)
      ) {
        this.scrollerRefresh();
      }
    }

    window.onhashchange = (e) => {
      delayRefresh(e);
    }
  }

  componentWillUnmount () {
    window.onhashchange = null;
  }

  render () {
    const { props } = this;
    
    return (
      <HashRouter>
        <div className="app">
          <Navigator 
            className="app__navigator"
            menus={props.menus}
          />
          <div ref="scene" className="app__scene">
            <Scroll ref="iscroll" iScroll={iScroll} options={{ mouseWheel: true, click: true }}>
              <div ref="sceneContent" className="app__scene-content">
                <Route path="/" component={Welcome} />
                <Route path="/list" component={List} />
                <Route path="/extensions" component={Extensions} />
              </div>
            </Scroll>
          </div>
          <Route path="/" component={Overview} />
          <Route path="/" component={ExtensionsView} />
        </div>  
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
