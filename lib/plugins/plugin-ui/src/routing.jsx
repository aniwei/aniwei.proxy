import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { BrowserRouter, Route, hashHistory, withRouter } from 'react-router-dom';


import App from './container/app';
import reducers from './reducers';
import constants from './constants';

class Routing extends React.Component {

  render () {
    const { props } = this;
    const { menus } = props;
    
    const store = createStore(reducers, props);

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Routing;

