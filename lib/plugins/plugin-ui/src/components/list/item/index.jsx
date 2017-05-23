import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Overview from './overview';

export default class Item extends React.Component {
  constructor () {
    super();

    this.state = {
      expanded: false
    };
  }

  onItemClick = () => {

  }

  contentRender () {
    return (
      <div className="app__list-item-group-content">
      </div>
    );
  }

  metaRender () {
    const { code, url, path, method, ip, route } = this.props;

    return (
      <Link to={route}>
        <div className="app__list-item-meta">
          <div className="app__list-item-status">{code}</div>
          <div className="app__list-item-subject">
            <div className="app__list-item-url">
              <div className="app__list-item-hole-url">{url}</div>
              <div className="app__list-item-path">{path}</div>
            </div>

            <div className="app__list-item-server">
              <div className="app__list-item-method">{method}</div>
              <div className="app__list-item-ip">{ip}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  render () {
    const { code, url, path, method, ip } = this.props;

    const classes = classnames({
      ['app__list-item']: true,
      ['app__list-item_expand']: this.state.expanded
    });

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
        {this.contentRender()}
      </div>
    );
  }
}