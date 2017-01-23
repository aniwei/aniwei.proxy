import React from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Sidebar extends React.Component {
  render () {
    return (
      <div className="app__sidebar">
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    header: state
  }
}


export default connect(mapStateToProps)(Sidebar);