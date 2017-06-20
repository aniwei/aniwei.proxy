import React from 'react';

import './less/index.less';

import util from '../../util';

const classNamespace = util.namespace('app__extension-view');

class ExtensionView extends React.Component {
  render () {
    return (
      <div className={classNamespace()}>
      
      </div>
    );
  }
}

export default ExtensionView;