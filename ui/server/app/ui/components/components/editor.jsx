import React, { createElement, PropTypes } from 'react';

import * as actions from '../../actions';
import constants from '../../constants';

import Container from './container';

export default class Editor extends React.Component {
  render () {
    const { children } = this.props;

    return (
      <div className="app__components-editor">
        <Container>
          {children}
        </Container>
      </div>
    );
  }
}