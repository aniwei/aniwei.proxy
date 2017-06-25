import React from 'react';

import util from '../../../util';

const classNamespace = util.namespace('app__overview-preview');

const Video = (props) => {
  const url = props.url;

  return (
    <div className={classNamespace('media')}>
      <video className={classNamespace('video')} src={`/plugin/requester/buffer?url=${url}`} />
    </div>
  );
};

export default Video;