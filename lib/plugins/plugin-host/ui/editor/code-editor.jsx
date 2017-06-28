import React, { createElement } from 'react';
import classnames from 'classnames';
import { assign } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('host-rules-codeeditor');
const editor = window.monaco.editor;

export default class CodeEditor extends React.Component {
  onEditorChange = (...args) => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(...args);
    }
  }

  componentDidMount () {
    const codeView = this.refs.codeView;
    const { value } = this.props;

    if (codeView) {
      this.editor = editor.create(codeView, assign({}, this.props));
      this.editor.onKeyUp(this.onEditorChange);
    }
  }

  render () {

    return (
      <div className={classNamespace()} ref="codeView">
      </div>
    );
  }
}