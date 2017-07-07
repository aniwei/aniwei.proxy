import React, { createElement } from 'react';
import { namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('host');

export default class Helpful extends React.Component {
  componentDidMount () {
    const { html } = this.props;

    if (this.refs.iframe) {
      this.refs.iframe.contentDocument.body.innerHTML = html;
    }
  }

  render () {
    return (
      <div className={classNamespace('iframe')}>
        <iframe frameBorder="0" ref="iframe" height="100%" width="100%">
        </iframe>
      </div>
    );
  }
}