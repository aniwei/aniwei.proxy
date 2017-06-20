import React from 'react';

import util from '../../../util';

const classNamespace = util.namespace('app__extension-search-bar');

const SearchBar = () => {
  return (
    <div className={classNamespace('search-bar')}>
      <i className={`iconfont icon-search ${classNamespace('icon')}`}></i>
      <input type="text" className={classNamespace('input')} placeholder="搜索" />
    </div>
  );
}

export default SearchBar;