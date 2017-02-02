import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { clone } from 'lodash';

import initialState from './store.json';
import reducers from '../../ui/reducers';
import htmlPage from './page';
import App from '../../ui/app';
import actions from '../../ui/actions';
import actionTypes from '../../ui/constants';

export default function main (req, res) {
  let app = req.app;
  let context = app.context;
  let initial = clone(initialState, app.get('store'));
  let plugin = [];

  plugin = plugin.filter((plg) => !plg.hidden);
  
  initial.socket = {}
  initial.scene.plugin = {
    item: plugin.map((plg) => {
      return {
        key: plg.key,
        description: plg.description
      }
    })
  }

  const store   = createStore(reducers, initial);
  const state   = store.getState();
  
  app.set('redux.store', store);
  app.set('redux.actions', actions);
  app.set('redux.type', actionTypes);

  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  res.send(htmlPage(html, state));
}

