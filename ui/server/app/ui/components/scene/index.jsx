import React, { createElement } from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Scene extends React.Component {

  render () {
    const { className } = this.props;

    return (
      <div className={`app__scene${className}`}>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var scene     = state.scene,
      className = '';

  if (scene.active) {
    className = ` app__sidebar-active`;
  }

  return {
    className: className 
  }
}


export default connect(mapStateToProps)(Scene);