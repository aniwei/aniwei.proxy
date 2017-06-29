
import React from 'react';
import 'whatwg-fetch';
import beautify from 'js-beautify';

import util from '../../../util';
import constants from '../../../constants';

import CodeEditor from './code-editor';

const classNamespace = util.namespace('app__overview-preview');
const language = {
  'text/html': 'html',
  'text/css': 'css',
  'application/json': 'json',
  'application/x-javascript': 'javascript',
  'application/javascript': 'javascript',
}


export default class Text extends React.Component {
  constructor (props) {
    super();

    this.state = {
      lineWrapping: false,
      beautify: false,
      previewContent: props.preview
    };
  }

  componentWillReceiveProps (nextProps) {
    if ('preview' in nextProps) {
      this.setState({
        previewContent: nextProps.preview
      });
    }
  }

  shouldComponentUpdate (nextProps) {
    if (
      nextProps.preivew === this.state.previewContent
    ) {
      return false;
    }

    return true;
  }

  componentDidMount () {
    this.fetch();
  }

  fetch () {
    const { id, url, type, preview, dispatch } = this.props;
    const api = `//${location.hostname}${location.port ? `:${location.port}` : ''}/plugin/requester/buffer?url=${url}`;

    if (!preview) {
      fetch(api)
        .then((res) => {
          return res.text();
        })
        .then((res) => {
          dispatch({
            type: constants.LIST_UPDATE,
            proxy: {
              list: [{
                id,
                previewContent: res
              }]
            }
          });
        });
    }
  }

  onToolClick = (key, e) => {
    const name = key.replace(/\w/, (w) => w.toUpperCase());
    const method = this[`on${name}`];

    if (typeof method === 'function') {
      method(e);
    }
  }

  onBeautify = () => {
    let type = this.contentType();

    type = type === 'javascript' ? 'js' : type;

    const method = `${type}_beautify`;
    const content = beautify[`${type}_beautify`](this.state.previewContent);

    this.setState({
      previewContent: content
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

  contentType () {
    const { type } = this.props;

    return language[type];
  }

  codeMirrorRender () {
    const { type } = this.props;
    const lang = language[type] || 'html';

    if (this.state.previewContent) {
      return (
        <CodeEditor 
          value={this.state.previewContent}
          language={lang}
          theme="vs-dark"
          folding={true}
          readOnly={true}
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