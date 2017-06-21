import React, { createElement } from 'react';
import { namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-tag');

class Tag extends React.Component {
  render () {
    return (
      <div className={classNamespace()}>

      </div>
    );
  }
}

export default Tag;