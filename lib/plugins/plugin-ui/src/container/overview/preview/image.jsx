
import React from 'react';
import queryString from 'query-string';

import util from '../../../util';

const classNamespace = util.namespace('app__overview-preview');

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

export default Image;