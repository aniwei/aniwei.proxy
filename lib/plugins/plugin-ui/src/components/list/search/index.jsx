import React from 'react';

const SearchBar = () => {
  return (
    <div className="app__list-search-bar">
      <i className="iconfont icon-search app__list-search-bar-icon"></i>
      <input type="text" className="app__list-search-bar-input" placeholder="搜索" />
    </div>
  );
}

export default SearchBar;