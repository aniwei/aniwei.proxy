import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router'

import 'whatwg-fetch';
import './index.css';
import './common/iconfont/index.css';
import './common/reset/index.css';
import './common/weui/index.css';

import components from './components'
import reducers from './reducers';
import io from 'socket.io-client';

import type from './constants';

const { Navigator, Scene, Proxy, Sidebar, Plugin, Setting, Midway } = components;
const { Mock, Replace, Host } = Midway;

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
  let data = res.data;

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

  socket.io.on('error', reconnnect);
  socket.io.on('disconnect', reconnnect);

  function reconnnect () {
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
      //
    })
  }

  const store = createStore(reducers, data);
  let item = data.navigationItem,
      nav;

  if (!(item == '')) {
    data.navigation.some((n, i) => {
      if (n.key === item) {
        return nav = n;
      }
    });

    store.dispatch({
      type: type.SIDEBAR_ACTIVE,
      active: nav.className
    });  
  }

  class App extends React.Component {
    render () {
      return <div className="view__app">
          <Navigator />
          <Scene>
            <Sidebar>
              <Plugin>
                <Mock name="mock"/>
                <Host name="host"/>
                <Replace name="replace"/>
              </Plugin>             
              <Setting />
            </Sidebar>
            <Proxy />
          </Scene>
      </div>
    }
  }


  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
})
