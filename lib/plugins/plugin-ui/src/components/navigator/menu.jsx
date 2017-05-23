import React from 'react';
import classnames from 'classnames';
import { NavLink, Link, withRouter } from 'react-router-dom';
import queryString from 'query-string';

class Menu extends React.Component {
  menusRender () {
    const { list, match, location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(location.search);    

    const listElement = list.map(menu => {
      const fillStyle = (menu.selected || menu.fixed ) ? 'fill' : 'line';
      const classes = classnames({
        [`iconfont`]: true,
        [`app__navigator-menu-item-icon`]: true,
        [`icon-${menu.key}-line`]: true
      });  
      const url = `/${menu.route}${location.search}`;

      return (
        <li className="app__navigator-menu-item" key={menu.key}>
          <NavLink className="app__navigator-menu-item-link" to={url} activeClassName={`icon-${menu.key}-full`}>
            <i className={classes}></i>
          </NavLink>
        </li>
      );
    });

    if (query.menu) {
      delete query.menu;
    } else {
      query.menu = 'visiable';
    }

    const url = `${pathname}?${queryString.stringify(query)}`;

    return (
      <div className="app__navigator-menu-wrapper">
        <Link to={url}>
          <div className="app__navigator-menu-button">
            <span className="app__navigator-menu-button-line"></span>
            <span className="app__navigator-menu-button-line"></span>
          </div>
        </Link>
        <ul className="app__navigator-menu-listview">
          {listElement}
        </ul>
      </div>
    );
  }

  render () {
    const { match, location } = this.props;
    const query = queryString.parse(location.search);    
    
    const classes = classnames({
      ['app__navigator-menu']: true,
      ['app__navigator-menu_active']: query.menu === 'visiable'
    })

    return (
      <div className={classes}>
        {this.menusRender()}
      </div>
    );
  }
}

export default withRouter(Menu);