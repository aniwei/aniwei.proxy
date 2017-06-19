import React from 'react';
import { connect } from 'react-connect';

class Context extends React.Component {
  render () {
    return (
      this.props.children
    );
  };
}

const mapStateToProps  = (state, ownProps) => {
  return {};
};

export default connect()(Context);