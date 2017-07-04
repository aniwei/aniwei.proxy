import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import App from './container/app';
import reducers from './reducers';

class Routing extends React.Component {
  
  render () {
    const { props } = this;
    const { reducers } = props;

    const store = createStore(combineReducers(reducers), props);

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Routing;

