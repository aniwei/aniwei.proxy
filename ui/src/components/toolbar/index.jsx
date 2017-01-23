import React from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Toolbar extends React.Component {
  render () {
    return (
      <div className="app__toolbar">
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    header: state
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch1: () =>{
      dispatch(actionCreator)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);