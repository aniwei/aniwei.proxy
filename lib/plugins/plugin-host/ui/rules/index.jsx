import React, { createElement, PropTypes, Component } from 'react';
import AceEditor from 'react-ace';


import CodeEditor from './code-editor';

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
        (disable ? '#' : '') + text + '\n'
      );

      li.push(
        list.map(li => (li.disable ? '# ' : '') + li.ip + ' ' + li.hostname.join(' ')).join('\n')
      );

      return li.join('\n');
    }).join('\n');

    return (
      <CodeEditor 
        value={content}
        language="html"
        theme="vs-dark"
        wordWrap={true}
        lineNumbers={false}
        folding={true}
      />
      // <AceEditor
      //   height="200"
      //   width="100%"
      //   mode="html"
      //   value={content}
      //   onChange={this.onChange}
      //   theme="monokai"
      //   name="act-editor"
      //   setOptions={{
      //     enableBasicAutocompletion: false,
      //     enableLiveAutocompletion: false,
      //     enableSnippets: false,
      //     tabSize: 2,
      //     showLineNumbers: false,
      //     showGutter: false
      //   }}
      // />
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