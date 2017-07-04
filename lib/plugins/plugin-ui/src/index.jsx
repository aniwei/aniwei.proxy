import React from 'react';
import SocketClient from 'socket.io-client';
import { render } from 'react-dom';
import ControlsContext from 'controls-context';

import './extensions';
import Routing from './routing';

render(
  <ControlsContext>
    <Routing {...store}/>
  </ControlsContext>,
  document.getElementById('app')
);