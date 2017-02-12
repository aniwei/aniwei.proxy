import React, { createElement } from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Specifics extends React.Component {
  constructor (props) {
    super();
  }

  render () {
    return (
      <div className="app__specifics">
        <div className="app__specifics-tabs">
          <div className="app__specifics-tab app__specifics-tab_current">Overview</div>
          <div className="app__specifics-tab">Request</div>
          <div className="app__specifics-tab">Response</div>
          <div className="app__specifics-tab">Timeline</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let proxy = state.proxy || {}

  return {
    header: proxy.cell.header,
    connection: state.socket.connection
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch1: () =>{
      dispatch(actionCreator)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Specifics);