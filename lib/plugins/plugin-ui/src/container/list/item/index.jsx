import React from 'react';
import classnames from 'classnames';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string';
import Scroll from 'react-iscroll';
import iScroll from 'iscroll';

import Overview from './overview';

import util from '../../../util';

const classNameSpace = util.namespace('app__list-item');

export default class Item extends React.Component {
  componentWillUnmount () {
    window.onhashchange = null;
  }

  contentRender (groupId, itemId) {
    const { group, id, match, location, overlayed } = this.props;
    const { code, url, path, method, ip, route, message, headers, tabs } = this.props;
    const query = queryString.parse(location.search);

    let classes;
    let elementView;

    if (query) {
      classes = classnames({
        [classNameSpace('content')]: true
      });
    }

    const props = {
      list: [
        {
          subject: 'General',
          key: 'general',
          list: [
            { key: 'url', text: 'URL', value: url },
            { key: 'method', text: 'Method', value: method },
            { key: 'code', text: 'Status', value: `${code || ''} ${message || ' - '}` },
            { key: 'code', text: 'Address', value: ip }
          ]
        },
        {
          subject: 'Request Headers',
          key: 'request',
          list: Object.keys(headers).map((hd, i) => {
            return {
              key: hd,
              text: hd,
              value: headers[hd]
            };
          })
        },
        {
          subject: 'Response Headers',
          key: 'response',
          list: Object.keys(headers).map((hd, i) => {
            return {
              key: hd,
              text: hd,
              value: headers[hd]
            };
          })
        }
      ]
    };

    elementView = <Overview {...props} location={location} tabs={tabs} />;

    return (
      <div className={classes}>
        {elementView}
      </div>
    );       
  }

  metaRender () {
    const { code, url, path, method, ip, route } = this.props;

    return (
      <Link to={route}>
        <div className={classNameSpace('meta')}>
          <div className={classNameSpace('status')}>{code || '-'}</div>
          <div className={classNameSpace('subject')}>
            <div className={classNameSpace('url')}>
              <div className={classNameSpace('hole-url')}>{url}</div>
              <div className={classNameSpace('path')}>{path}</div>
            </div>

            <div className={classNameSpace('server')}>
              <div className={classNameSpace('method')}>{method}</div>
              <div className={classNameSpace('ip')}>{ip}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  render () {
    const { overlayed } = this.props;
    const { group, id, match, location } = this.props;
    const query = queryString.parse(location.search);
    const isExpand = query.group - 0 === group && query.id - 0 === id;

    const classes = classnames({
      [classNameSpace()]: true,
      [classNameSpace(undefined, 'overlayed')]: !!overlayed,
      [classNameSpace('content', 'expand')]: isExpand
    });

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
        {this.contentRender()}
      </div>
    );
  }
}