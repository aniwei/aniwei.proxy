import React, { createElement } from 'react';
import { registor, namespace } from 'aniwei-proxy-extension-context';

import './less/index.less';

const classNamespace = namespace('sim');

class Simulator extends React.Component {
  render () {
    return (
      <div className={classNamespace()}>

      </div>
    );
  }
}

const reducers = {};

export default registor(reducers)('simulator', Simulator);