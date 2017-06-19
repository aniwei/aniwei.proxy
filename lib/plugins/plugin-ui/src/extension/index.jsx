import React from 'React';

import util from '../../util';

const classNamespace = util.namespace('app__extension');

class Extension extends React.Component {
  render () {
    return (
      <div className={classNamespace()}>
      </div>
    );
  }
}

export default Extension;
