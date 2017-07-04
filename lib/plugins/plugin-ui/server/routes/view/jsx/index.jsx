import React, { createElement } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import App from '../../../../src/container/app';

let store;

class Routing extends React.Component {
  static store = store;

  render () {
    const { props } = this;
    const { reducers } = props;

    store = store || createStore(combineReducers(reducers), props);

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Routing;

