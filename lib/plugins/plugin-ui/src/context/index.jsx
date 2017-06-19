import React, { cloneElement } from 'react';
import { combineReducers } from 'redux';
import { connect } from 'react-redux';

import constants from '../constants';

const extensions = [];
const actionConstants = constants.actionConstants;
const reducers = [];

class ExtensionContext extends React.Component {
  static register (constant, reducer) {

    return function (name, component) {
      const exist = extensions.some(ext => ext.name === name);

      if (exist) {
        throw 'extension was already existed';
      }

      reducers.push(reducer);
      constant.forEach(cst => actionConstants(`EXTENSION_${name.toUpperCase()}`));

      extensions.push(component);
    }
  }

  render () {
    return (
      cloneElement(this.props.children, {
        reducers:
      })
    );
  };
}

const mapStateToProps  = (state, ownProps) => {
  return {};
};

const { register } = ExtensionContext;

debugger;

register([
  'UPDATE'
], {

})('TEST', ExtensionContext);

export default connect(mapStateToProps)(ExtensionContext);