import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-edit');

class Row extends React.Component {
  render () {
    return (
      <div className={classNamespace('row')}>
        <div className={classNamespace('row-title')}>
          类型
        </div>
      </div>
    );
  }
}

class Editor extends React.Component {
  
  render () {
    return (
      <div className={classNamespace()}>
        <div className={classNamespace('type')}></div>
      </div>
    );
  }
}

export default Editor;