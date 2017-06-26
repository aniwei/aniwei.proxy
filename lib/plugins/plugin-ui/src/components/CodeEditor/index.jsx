import React from 'react';
import classnames from 'classnames';

import './less/index.less';
import util from '../../util';

const classNamespace = util.namespace('app__code-editor');

const editor = monaco.editor;

export default class CodeEditor extends React.Component {
  componentDidMount () {
    const codeView = this.refs.codeView;
    const { value } = this.props;

    if (codeView) {
      this.editor = editor.create(codeView, this.props);
    }
  }

  render () {

    return (
      <div className={classNamespace()} ref="codeView">
      </div>
    );
  }
}