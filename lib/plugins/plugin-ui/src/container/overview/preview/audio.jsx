import React from 'react';

import util from '../../../util';

const classNamespace = util.namespace('app__overview-preview');

const Audio = (props) => {
  const url = props.url;
  const src =  `//${location.hostname}${location.port ? `:${location.port}` : ''}/resource?url=${url}`;

  return (
    <div className={classNamespace('media')}>
      <audio className={classNamespace('video')} src={`/plugin/requester/buffer?url=${url}`} controls preload />
    </div>
  );
};

export default Audio;