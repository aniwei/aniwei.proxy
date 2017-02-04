import React, { createElement, PropTypes } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { histor, Router, Route } from 'react-router';

import io from 'socket.io-client';

import reducers from './reducers';
import actions from './actions';
import constants from './constants';

import App from './app';

const initialState = window.__INITIAL_STATE__;

//const connection = io(initialState.socket.uri);

//initialState.socket.connection = connection;
//initialState.midway = midway;

const store = createStore(reducers, initialState);

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}, false);




