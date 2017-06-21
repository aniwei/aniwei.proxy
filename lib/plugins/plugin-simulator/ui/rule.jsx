import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-rule');

class Rule extends React.Component {
  
  render () {
    const { subject, type } = this.props

    return (
      <div className={classNamespace()}>
        <div className={classNamespace('title')}>
          {subject}
        </div>
        <div className={classNamespace('content')}>
          <div className={classNamespace('type')}></div>
          <div className={classNamespace('value')}></div>
        </div>
      </div>
    );
  }
}

export default Rule;