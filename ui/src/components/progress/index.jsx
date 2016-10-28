import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CircularProgress from 'material-ui/CircularProgress';

const Progress = () => {
  return <CircularProgress />
}

function mapStateToProps (state) {
  return {
    open: state.progressDisplay
  }
}

export default connect(mapStateToProps)(Progress)
