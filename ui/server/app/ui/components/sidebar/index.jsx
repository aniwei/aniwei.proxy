import React, { createElement } from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Sidebar extends React.Component {
  render () {
    const { children } = this.props;
    let cls = children ? ' app__sidebar_active' : '',
        classes = `app__sidebar${cls}`;

    return (
      <div className={classes}>
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