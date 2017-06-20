import React from 'react';
import classnames from 'classnames';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string';

import util from '../../../util';

const classNamespace = util.namespace('app__extension-item');

export default class Item extends React.Component {
  metaRender () {
    const { description, route } = this.props;

    return (
      <Link to={route}>
        <div className={classNamespace('meta')}>
          {/*<div className={classNamespace('status')}>{}</div>*/}
          <div className={classNamespace('subject')}>
            <div className={classNamespace('desc')}>
              <div className={classNamespace('desc-name')}>{description.text}</div>
              <div className={classNamespace('desc-brief')}>{description.brief}</div>
            </div>

            <div className="app__list-item-server">
              {/*<div className="app__list-item-method">{method}</div>*/}
              {/*<div className="app__list-item-ip">{ip}</div>*/}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  render () {
    const { code, url, path, method, ip } = this.props;

    const classes = classnames({
      ['app__list-item']: true
    });

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
      </div>
    );
  }
}