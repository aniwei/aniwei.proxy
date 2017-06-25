
import React from 'react';
import 'whatwg-fetch';
import { js_beautify as beautify } from 'js-beautify';

import util from '../../../util';
import constants from '../../../constants';

import CodeMirrorView from './codemirror';

const classNamespace = util.namespace('app__overview-preview');

export default class Text extends React.Component {
  constructor () {
    super();

    this.state = {
      text: null,
      lineWrapping: false,
      beautify: false
    };
  }

  componentDidMount () {
    this.fetch();
  }

  fetch () {
    const { url, type } = this.props;
    const api = `//${location.hostname}${location.port ? `:${location.port}` : ''}/plugin/requester/buffer?url=${url}`;

    fetch(api)
      .then((res) => {
        return res.text();
      })
      .then((res) => {
        this.setState({
          text: res
        });
      });
  }

  onToolClick = (key, e) => {
    const name = key.replace(/\w/, (w) => w.toUpperCase());
    const method = this[`on${name}`];

    if (typeof method === 'function') {
      method(e);
    }
  }

  onBeautify = () => {
    const { type } = this.props;

    console.log(Object.keys(beautify));

    this.setState({
      text: beautify.html(this.state.text)
    });
  }

  onWrapping = () => {
    this.setState({
      lineWrapping: !this.state.lineWrapping
    });
  }

  toolRender () {
    const tools = [
      { key: 'beautify', text: '{}' },
      { key: 'wrapping', text: '」' }
    ];

    const items = tools.map((t) => {
      return (
        <div className={classNamespace('tool-item')} key={t.key} onClick={(e) => this.onToolClick(t.key, e)}>
          {t.text}
        </div>
      );
    });

    return (
      <div className={classNamespace('tool-listview')}>
        {items}
      </div>
    );
  }

  codeMirrorRender () {
    if (this.state.text) {
      return (
        <CodeMirrorView 
          value={this.state.text}
          foldGutter={true}
          lineNumbers={true}
          styleActiveLine={true}
          readOnly={true}
          matchBrackets={true}
          lineWrapping={this.state.lineWrapping}
          viewportMargin={Infinity}
          gutters={[
            'CodeMirror-linenumbers',
            'CodeMirror-foldgutter',
            'CodeMirror-lint-markers'
          ]}
          theme="seti"
        />
      );
    }
  }

  render () {
    return (
      <div className={classNamespace('text')}>
        {this.codeMirrorRender()}
        {this.toolRender()}
      </div>
    );
  }
}