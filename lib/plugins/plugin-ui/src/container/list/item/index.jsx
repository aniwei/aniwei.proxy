import React from 'react';
import classnames from 'classnames';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string';

import Overview from './overview';

export default class Item extends React.Component {
  onItemClick = () => {

  }

  onViewScroll = (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log(e.target.scrollTop, e.target.scrollHeight, e.target.style.height);
  }

  contentRender (groupId, itemId) {
    const { group, id, match, location } = this.props;
    const query = queryString.parse(location.search);

    return (
      <Route path="/list" render={({ location, match }) => {
        const { code, url, path, method, ip, route, message, headers } = this.props;

        let classes;
        let elementView;

        if (query) {
          classes = classnames({
            ['app__list-item-content']: true
          });
        }

        const props = {
          list: [
            {
              subject: 'General',
              list: [
                { key: 'url', text: 'URL', value: url },
                { key: 'method', text: 'Method', value: method },
                { key: 'code', text: 'Status', value: `${code || ''} ${message || ' - '}` },
                { key: 'code', text: 'Address', value: ip }
              ]
            },
            {
              subject: 'Request Headers',
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

        elementView = <Overview {...props} location={location} />;

        return (
          <div className={classes} onScroll={this.onViewScroll}>
            {elementView}
          </div>
        );       
      }}/>  
     
    );
  }

  metaRender () {
    const { code, url, path, method, ip, route } = this.props;

    return (
      <Link to={route}>
        <div className="app__list-item-meta">
          <div className="app__list-item-status">{code || '-'}</div>
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
    const { overlayed } = this.props;
    const { group, id, match, location } = this.props;
    const query = queryString.parse(location.search);
    const isExpand = query.group - 0 === group && query.id - 0 === id;

    const classes = classnames({
      ['app__list-item']: true,
      ['app__list-item_overlayed']: !!overlayed,
      ['app__list-item-content_expand']: isExpand
    });

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
        {this.contentRender()}
      </div>
    );
  }
}