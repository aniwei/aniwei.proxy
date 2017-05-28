import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

class SearchBar extends React.Component {
  onSearchClick = () => {

  }

  onToggleClick = () => {
    const { toggled, onToggled } = this.props;

    if (typeof onToggled === 'function') {
      onToggled(!toggled);
    }
  }

  render () {
    const { location } = this.props;
    const qs = queryString.parse(location.search);

    if (!qs.tool) {
      qs.tool = 'visiable';
    } else {
      delete qs.tool;
    }

    return (
      <div className="app__list-search-bar">
        <div className="app__list-search-bar-input">
          <i className="iconfont icon-search app__list-search-bar-input-icon" onClick={this.onSearchClick}></i>
          <input type="text" className="app__list-search-bar-input-text" placeholder="搜索" />
        </div>
        <Link to={`${location.pathname}?${queryString.stringify(qs)}`}>
          <i className="iconfont icon-more-fill app__list-search-bar-icon" onClick={this.onToggleClick}></i>
        </Link>
      </div>
    );
  }
}

export default SearchBar;