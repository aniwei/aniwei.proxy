import React, { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './css/index.css';
import './css/components.css';

import Preview from './preview';
import Editor from './editor';


class Components extends React.Component {
  render () {
    const { className, children, item } = this.props;
    let classes = children ? 'app__components app__components_selected' : 'app__components';

    return (
      <div className={classes}>
        <Preview item={item}/>
        <Editor>
          {children}
        </Editor>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let components = state.components;

  return {
    item: components
  }
}

export default connect(mapStateToProps)(Components);