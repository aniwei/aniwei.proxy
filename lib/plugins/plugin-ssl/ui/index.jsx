import React, { createElement } from 'react';
import { register, namespace } from 'aniwei-proxy-extension-context';

import './less/index.less';

const classNamespace = namespace('ssl');

class SSL extends React.Component {
  render () {
    return (
      <div className={classNamespace()}>
        <div className={classNamespace('download-text')}>
          <a className={classNamespace('download-link')} href="/ssl.crt">下载证书</a>
        </div>
      </div>
    );
  }
}

const reducers = {

};

export default register(reducers)('ssl-crt', SSL);