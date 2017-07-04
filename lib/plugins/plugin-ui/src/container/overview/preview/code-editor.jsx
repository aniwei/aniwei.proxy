import React from 'react';
import { assign } from 'lodash';


export default class CodeEditor extends React.Component {
  componentDidMount () {
    const codeView = this.refs.codeView;
    const { value } = this.props;
    const editor = window.monaco.editor;

    if (codeView) {
      this.editor = editor.create(codeView, assign({}, this.props));
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      if (this.editor) {
        this.editor.setValue(nextProps.value);
      }
    }
  }

  render () {

    return (
      <div className="app__overview-preview-code-view" ref="codeView">
      </div>
    );
  }
}