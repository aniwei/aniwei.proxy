import React from 'react';

import CodeMirror from 'codemirror';

// import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


export default class CodeMirrorView extends React.Component {
  onChange = () => {}

  componentDidMount () {
    let editor = this.refs.editor;

    if (!editor.getAttribute) {
      editor = editor.getDOMNode();
    }

    this.editor = CodeMirror.fromTextArea(editor, this.props);
    this.editor.on('change', this.onChange);
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
      <div className="app__list-item-overview-codemirror">
        {editor}
      </div>
    );
  }
}