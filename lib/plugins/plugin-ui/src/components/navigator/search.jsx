import React from 'react';

const SearchBar = () => {
  return (
    <div className="app__navigator-search-bar">
      <i className="iconfont icon-search app__navigator-search-bar-icon"></i>
      <input type="text" className="app__navigator-search-bar-input" placeholder="搜索" />
    </div>
  );
}

export default SearchBar;