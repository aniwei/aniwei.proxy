import React from 'react';
import queryString from 'query-string';
import path from 'path';
import urlParser from 'url-parse';
import 'whatwg-fetch';
import { js_beautify as beautify } from 'js-beautify';

import util from '../../util';
import CodeMirrorView from './codemirror';

const classNamespace = util.namespace('app__overview-preview');
const initState = window.__initState__;

const isApplicationStream = (type) => {
  return 'application/octet-stream' === type;
}

const isImage = function (type) {
  return this.ext.some((ext) => {
    return `image/${ext}` === type;
  });
}

const isAudio = function (type) {
  return this.ext.some((ext) => {
    return `audio/${ext}` === type;
  });
}

const isVideo = function (type) {
  return this.ext.some((ext) => {
    return `video/${ext}` === type;
  });
}

const isText = function (type) {
  return this.ext.some(function (ext) {
    return ext === type;
  });
}

const mimeType = (type, pathname) => {
  const list = [
    { element: Image, is: isImage, ext: 'bmp gif jpeg jpg svg+xml png'.split(' ') },
    { element: Audio, is: isAudio, ext: 'ogg mp3 mp4 wav'.split(' ') },
    { element: Video, is: isVideo, ext: 'ogg mp4 webm'.split(' ') },
    { element: Text, is: isText, ext: 'text/html text/css text/javascript text/plain application/javascript application/x-javascript application/json'.split(' ') }
  ];
  let element;
  let ext;

  if (isApplicationStream(type)) {
    'bmp gif jpeg jpg svg+xml png ogg mp3 wav mp4 webm'.split(' ').some((e) => {
      if (pathname.indexOf(`.${e}`) > -1) {
        return ext = e;
      } 
    });

    if (ext) {
      if (list.some((m) => {
        if (m.ext.indexOf(ext) > -1) {
          return element = m.element;
        }
      })) {
        return element;
      } else {
        return Unknown;
      }
    } else {
      element = Unknown;
    }
  } else {
    if (list.some(function (m) {
      if (m.is(type)) {
        return element = m.element;
      }
    })) {
      return element;
    } else {
      return Unknown;
    }
  }
};



const Image = (props) => {
  const url = props.url;
  const index = url.indexOf('?');
  const query = url.slice(index);
  const qs = queryString.parse(query);

  return (
    <div className={classNamespace('media')}>
      <img className={classNamespace('image')} src={url} alt={query.url} />
    </div>
  );
};

const Video = (props) => {
  const url = props.url;

  return (
    <div className={classNamespace('media')}>
      <video className={classNamespace('video')} src={url} />
    </div>
  );
};

const Audio = (props) => {
  const url = props.url;
  const src =  `//${location.hostname}${location.port ? `:${location.port}` : ''}/resource?url=${url}`;

  return (
    <div className={classNamespace('media')}>
      <audio className={classNamespace('video')} src={url} controls preload />
    </div>
  );
};

class Text extends React.Component {
  constructor () {
    super();

    this.state = {
      text: null
    };
  }

  componentDidMount () {
    this.fetch();
  }

  fetch () {
    const { url } = this.props;
    const api = `//${location.hostname}${location.port ? `:${location.port}` : ''}/resource?url=${url}`;

    fetch(api)
      .then((res) => {
        return res.text();
      })
      .then((res) => {
        this.setState({
          text: beautify(res)
        });
      });
  }

  codeMirrorRender () {
    if (this.state.text) {
      return (
        <CodeMirrorView 
          value={this.state.text}
          lineNumbers={true}
          styleActiveLine={true}
          readOnly={true}
          matchBrackets={true}
          textWrapping={true}
          theme="material"
        />
      );
    }
  }

  render () {
    return (
      <div className={classNamespace('text')}>
        {this.codeMirrorRender()}
      </div>
    );
  }
}

const Unknown = () => {
  return (
    <div className={classNamespace('unknown')}>
      Can Not Preview This Content Type.
    </div>
  );
};

class Preview extends React.Component {
  contentType () {
    const { type, url } = this.props;
    const urlParsed = urlParser(url);
    let element = mimeType(type, urlParsed.pathname);

    return React.createElement(element, {
      url
    });
  }

  render () {

    return (
      <div className="app__overview-preview">
        {this.contentType()}
      </div>
    );
  }
}

export default Preview;