import React, { createElement, PropTypes, Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace } from 'aniwei-proxy-extension-context';

import './css/index.css';

class Host extends Comment {
  render () {
    return (
      <div>

      </div>
    );
  }
}

const reducers = {
  [`UPDATE`]: () => {}
};


export default register(reducers)('host', Host);