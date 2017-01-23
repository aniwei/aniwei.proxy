import React from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Scene extends React.Component {

  render () {
    const { className } = this.props;

    return (
      <div {...this.props} className={`app__scene${className}`}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var home      = state.home,
      className = '';

  if (home.active) {
    className = ` app__sidebar-active app__sidebar-${home.active}`;
  }

  return {
    className: className 
  }
}


export default connect(mapStateToProps)(Scene);