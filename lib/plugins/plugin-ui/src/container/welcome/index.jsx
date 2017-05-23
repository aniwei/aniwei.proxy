import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Settings extends React.Component {
  render () {
    return (
      <div className="app__setting"></div>
    );
  }
}

export default withRouter(connect()(Settings));