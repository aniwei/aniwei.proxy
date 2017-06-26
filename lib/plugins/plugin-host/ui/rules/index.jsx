import React, { createElement, PropTypes, Component } from 'react';
import iScroll from 'iscroll';
import Scroll from 'react-iscroll';
import MonacoEditor from 'react-monaco-editor';

import 'monaco-editor/dev/vs/loader.js';

import { createStore, applyMiddleware } from 'redux';
import { register, namespace, Button } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('host-rules');

export default class Rules extends React.Component {
  constructor () {
    super();    
  }

  onTextChange = (cm, e) => {
    clearTimeout(this.timer);

    this.codeMirrorText = cm.getValue();

    this.timer = setTimeout(() => {
      this.textParser();
    }, 200);
  }

  textParser () {
    const text = this.codeMirrorText || '';

    const splitedText = text.split(/[\n\r]+/g);

    splitedText.filter(t => t.trim()).map((t) => {

    });
  }

  rulesRender () {
    const { rules } = this.props;

    const content = rules.map((ru, i) => {
      const { text, list, group, disable } = ru;
      const li = [];

      li.push(
        (disable ? '####' : '+ ') + text + '\n'
      );

      li.push(
        list.map(li => (li.disable ? '# - ' : '-') + li.ip + ' ' + li.hostname.join(' ')).join('\n')
      );

      return li.join('\n');
    }).join('\n');

    return (
      <MonacoEditor
        height="200"
        language="javascript"
        value={content}
        onChange={this.onChange}
      />
    );
  }

  render () {
    const { text } = this.props;

    return (
      <div className={classNamespace()}>
        {this.rulesRender()}
      </div>
    );
  };
}