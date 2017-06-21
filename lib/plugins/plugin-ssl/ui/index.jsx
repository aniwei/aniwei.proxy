import React from 'react';
import { register, namespace } from 'aniwei-proxy-extension-context';

import './index.css';

const classNamespace = namespace('ssl');

class SSL extends React.Component {
  render () {
    <div className={classNamespace()}>
      <div className={classNamespace('download-text')}>点击下载</div>
    </div>
  }
}

const reducers = {}

export default register(reducers)('ssl-crt', SSL);