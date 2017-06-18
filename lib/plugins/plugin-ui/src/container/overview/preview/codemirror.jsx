import React from 'react';
import CodeMirror from 'codemirror';

import { assign } from 'lodash';

// import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


export default class CodeMirrorView extends React.Component {
  onChange = () => {}

  componentDidMount () {
    const editor = this.refs.editor;
    const codemirror = this.refs.codemirror;
    const height = window.getComputedStyle(codemirror).height;

    this.editor = CodeMirror.fromTextArea(editor,this.props);
    this.editor.setSize(null, height);
    this.editor.on('change', this.onChange);
  }

  shouldComponentUpdate (nextProps) {
    const { lineWrapping } = this.props;

    if (nextProps.lineWrapping !== lineWrapping) {
      this.editor.setOption('lineWrapping', nextProps.lineWrapping);
    }

    return false;
  }

  render () {
    const { value, readOnly, defaultValue, onChange } = this.props;
    const editor = <textarea
      ref="editor" 
      readOnly={readOnly || true}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    />;

    return (
      <div ref="codemirror" className="app__overview-preview-codemirror">
        {editor}
      </div>
    );
  }
}