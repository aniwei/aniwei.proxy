import React, { createElement } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, IndexRoute, withRouter } from 'react-router'

import './css/index.css';
import * as actions from '../../actions';
 
class Navigator extends React.Component {
  
  componentDidMount () {
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick (i, nav) {
    const { onClick, onActive } = this.props;

    onClick(nav.key);
    onActive(nav.key == 'middleware');
  }

  itemRender () {
    const { item, location } = this.props;
    let elements,
        name = location.pathname.slice(1);
        
    if (!item) {
      return undefined;
    }

    elements = item.map((nav, i) => {
      let className = ' app__navigator-menu-item_current',
          clses = '';

      switch (name.indexOf(nav.key) > -1) {
        case true:
          clses = className;
          break;
        case false:
          if (!name) {
            if (nav.key === 'proxy') {
              clses = className;
            }
          }
      }
      
      className = `app__navigator-menu-item app__navigator-menu-home${clses}`;

      return (
        <li key={i} className={className}>
          <Link to={nav.route}>
            <i className={`iconfont app__navigator-menu-icon icon-${nav.icon}`}></i>
          </Link>
        </li>
      );
    });

    return (
      <ul className="app__navigator-menu">
        {elements}
      </ul>
    );
  }

  render () {
    return (
      <div className="app__navigator">
        <div className="app__navigator-image-main">
          <img src="" alt="" className="app__navigator-image"/>
        </div>
        {this.itemRender()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let { item, current } = state.navigator;

  return {
    item,
    current
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    onClick: actions.navigatorItemTap,
    onActive: actions.sceneActive
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));