import React from 'react';
import queryString from 'query-string';
import path from 'path';
import urlParser from 'url-parse';
import 'whatwg-fetch';
import { js_beautify as beautify } from 'js-beautify';

import util from '../../../util';

import Text from './text';
import Image from './image';
import Video from './video';
import Audio from './audio';

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

const Unknown = () => {
  return (
    <div className={classNamespace('unknown')}>
      Unknown Content Type.
    </div>
  );
};

const Empty = () => {
  return (
    <div className={classNamespace('empty')}>
      No Content.
    </div>
  );
}

class Preview extends React.Component {
  contentType () {
    const { type, url } = this.props;
    const urlParsed = urlParser(url);
    let element = mimeType(type, urlParsed.pathname);

    if (type === undefined) {
      return (
        <Empty />
      );
    }

    return React.createElement(element, {
      url: encodeURIComponent(url),
      type
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