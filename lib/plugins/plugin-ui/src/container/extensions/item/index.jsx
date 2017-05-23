import React from 'react';
import classnames from 'classnames';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string';

export default class Item extends React.Component {
  onItemClick = () => {

  }

  contentRender (groupId, itemId) {
    const { group, id, match, location } = this.props;
    const query = queryString.parse(location.search);

    return (
      <Route path="/list" render={({ location, match }) => {
        let classes;

        if (query) {
          classes = classnames({
            ['app__list-item_expand']: query.group - 0 === group && query.id - 0 === id,
            ['app__list-item-overview']: true
          });
        }

        return (
          <div className={classes}>
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
      ['app__list-item']: true
    });

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
        {this.contentRender()}
      </div>
    );
  }
}