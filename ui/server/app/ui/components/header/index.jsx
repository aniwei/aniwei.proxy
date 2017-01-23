import React, { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import './css/index.css';

import Request from './request';
import Response from './response';

class Header extends React.Component {
  render () {
    const { className, children, item } = this.props;
    let classes = children ? 'app__plugin app__plugin_selected' : 'app__plugin';

    return (
      <div className={classes}>
        <Request item={item}/>
        <Response />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let plugin = state.scene.plugin;

  return {
    item: plugin.item
  }
}

export default withRouter(connect(mapStateToProps)(Header));