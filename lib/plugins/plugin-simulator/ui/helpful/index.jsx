import React, { createElement } from 'react';
import { namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim');

export default class Helpful extends React.Component {
  render () {
    return (
      <div className={classNamespace('iframe')}>
        <iframe frameBorder="0" height="100%" width="100%" src="/plugin/host/README.md">
        </iframe>
      </div>
    );
  }
}