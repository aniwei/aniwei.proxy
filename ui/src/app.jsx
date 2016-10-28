import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import themes from './common/themes';

import injectTapEventPlugin from 'react-tap-event-plugin';


import 'whatwg-fetch';
import './index.css';

import components from './components'
import reducers from './reducers';
import io from 'socket.io-client';

const { Navigation, Scene } = components;
import { SOCKET } from './constants'

injectTapEventPlugin();

class App extends React.Component {
  render () {
    return <div className="view__app">
        <Scene />
        <Navigation />
    </div>
  }
}

fetch('/main', {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}).then((res) => {
  if (res.status == 200) {
    return res.json()
  }
}).then(function(res){
  let data        = res.data,
      navigation  = data.navigation;

  navigation.forEach((nav) => nav.scene = React.createElement(components[nav.scene], nav));

  return data;
}).then(function(data){
  let socket = data.socket;

  socket.io = io(socket.uri);
  socket.io.on('proxy.request', function () {
    console.log('socket was connected')
  })
  socket.io.on('proxy.request', function () {
    console.log(arguments);
  })
  socket.io.on('error', function () {
    fetch('/socket', {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }).then(function (res) {
      if (res.status == 200) {
        return res.json()
      }
    })
    .then(function (res) {
      if (res.code == 0) {
        store.dispatch({
          type: SOCKET,
          socket: res.data
        })
      }
    })
    .catch(function (err) {
      throw err;
    })
  })

  const store = createStore(reducers, data);

  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(themes.studio)}>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  );
})
