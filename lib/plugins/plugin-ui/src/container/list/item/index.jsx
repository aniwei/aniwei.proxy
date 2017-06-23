import React from 'react';
import classnames from 'classnames';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string';
import Scroll from 'react-iscroll';
import iScroll from 'iscroll';

import Overview from './overview';

import util from '../../../util';
import constants from '../../../constants';
import Seti from '../../../components/seti';

const classNameSpace = util.namespace('app__list-item');

export default class Item extends React.Component {
  componentWillUnmount () {
    window.onhashchange = null;
  }

  contentRender (groupId, itemId) {
    const { group, id, match, location, dispatch } = this.props;
    const { code, url, path, method, ip, route, message, requestHeaders, responseHeaders } = this.props;
    const query = queryString.parse(location.search);

    let classes;
    let elementView;

    if (query) {
      classes = classnames({
        [classNameSpace('content')]: true
      });
    }

    const props = {
      dispatch,
      list: [
        {
          subject: 'General',
          key: 'general',
          list: [
            { key: 'url', text: 'url', value: url },
            { key: 'method', text: 'method', value: method },
            { key: 'code', text: 'status', value: `${code || ''} ${message || ' - '}` },
            { key: 'code', text: 'address', value: ip }
          ]
        },
        {
          subject: 'Request Headers',
          key: 'request',
          list: Object.keys(requestHeaders).map((hd, i) => {
            return {
              key: hd,
              text: hd,
              value: requestHeaders[hd]
            };
          })
        }
      ]
    };

    if (responseHeaders) {
      props.list.push({
        subject: 'Response Headers',
        key: 'response',
        list: Object.keys(responseHeaders).map((hd, i) => {
          return {
            key: hd,
            text: hd,
            value: responseHeaders[hd]
          };
        })
      });
    }

    elementView = <Overview {...props} location={location} />;

    return (
      <div className={classes}>
        {elementView}
      </div>
    );       
  }

  metaRender () {
    const { code, url, path, method, ip, route, extension } = this.props;
    const classes = classnames({
      [classNameSpace('visual-type')]: true
    });
    let element;

    if (!!extension) {
      element = <i className={`seti-${extension} seti`}></i>;
    }

    return (
      <Link to={route}>
        <div className={classNameSpace('meta')}>
          <div className={classNameSpace('visual')}>
            {code || '-'}
          </div>
          
          <div className={classNameSpace('subject')}>
            <div className={classNameSpace('url')}>
              <div className={classNameSpace('hole-url')}>
                {element}
                <span className={classNameSpace('hole-url-text')}>{url}</span>
              </div>
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
      [classNameSpace(undefined, 'overlayed')]: !!overlayed
      // [classNameSpace('content', 'expand')]: isExpand
    });

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
      </div>
    );
  }
}