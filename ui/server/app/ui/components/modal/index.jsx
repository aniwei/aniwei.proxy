import React, { createElement } from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Modal extends React.Component {

  render () {
    const { className } = this.props;

    return (
      <div className={`app__modal${className}`}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var scene     = state.scene,
      className = '';

  if (scene.active) {
    className = ` app__sidebar-active app__sidebar-${home.active}`;
  }

  return {
    className: className 
  }
}


export default connect(mapStateToProps)(Modal);