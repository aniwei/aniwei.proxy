import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

import Rule from './rule';

const classNamespace = namespace('sim-editor');

class Editor extends React.Component {

  onAppendClick () {

  }

  appenderRender () {
    return (
      <div className={classNamespace('appender')}>
        
      </div>
    );
  }

  render () {
    return (
      <div className={classNamespace()}>
        <Rule />
      </div>
    );
  }
}

export default Editor;