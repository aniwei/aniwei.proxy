import React, { createElement } from 'react';
import classnames from 'classnames';
import { assign } from 'lodash';
import { register, namespace, Button } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('host-rules-codeeditor');
const editor = window.monaco.editor;

export default class CodeEditor extends React.Component {
  componentDidMount () {
    const codeView = this.refs.codeView;
    const { value } = this.props;

    if (codeView) {
      this.editor = editor.create(codeView, assign({}, this.props));
    }
  }

  render () {

    return (
      <div className={classNamespace()} ref="codeView">
      </div>
    );
  }
}