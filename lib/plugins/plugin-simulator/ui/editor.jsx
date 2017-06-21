import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-edit');

class Editor extends React.Component {
  
  render () {
    return (
      <div className={classNamespace()}>
        {this.appenderRender()}
        {this.tagRender()}
      </div>
    );
  }
}

export default Editor;