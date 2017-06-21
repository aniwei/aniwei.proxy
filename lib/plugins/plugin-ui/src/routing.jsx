import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { BrowserRouter, Route, hashHistory, withRouter } from 'react-router-dom';


import App from './container/app';
import reducers from './reducers';
import constants from './constants';

class Routing extends React.Component {
  static contextTypes = {
    extension: React.PropTypes.object
  };

  render () {
    const { props, context } = this;
    const { extension } = context;

    reducers.extension = extension.reducer;

    const store = createStore(combineReducers(reducers), props);

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Routing;

