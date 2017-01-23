import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router'

import './css/index.css';
import * as actions from '../../actions';

import {  } from 'react-weui';
 
class Navigator extends React.Component {
  
  componentDidMount () {
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick (i, nav) {
    const { onClick, toActive } = this.props;

    onClick(nav.key);
    toActive(nav.className);
  }

  itemRender () {
    const { item, current } = this.props;
    let elements;

    elements = item.map((nav, i) => {
      let onClick = () => this.onItemClick(i, nav),
          className = ' app__navigator-menu-item_current',
          clses = '';

      switch (nav.key == current) {
        case true:
          clses = className;
          break;
        case false:
          if (!current) {
            if (nav.key === '') {
              clses = className;
            }
          }
      }
      
      className = `app__navigator-menu-item app__navigator-menu-home${clses}`;

      return (
        <li onClick={onClick} key={i} className={className}>
          <i className={`iconfont app__navigator-menu-icon icon-${nav.icon}`}></i>
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
  return {
    item: state.navigation,
    current: state.navigationItem
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    onClick: actions.navigationTouchTap,
    toActive: actions.sidebarActive
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);