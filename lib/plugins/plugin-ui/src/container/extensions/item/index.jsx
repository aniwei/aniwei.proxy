import React, { createElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link, Route } from 'react-router-dom';
import { assign } from 'lodash';

import util from '../../../util';

const classNamespace = util.namespace('app__extension-item');

export default class Item extends React.Component {
  
  metaRender () {
    const { description, route } = this.props;

    return (
      <Link to={route}>
        <div className={classNamespace('meta')}>
          <div className={classNamespace('avtor')}>{description.text}</div>
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

  contentRender () {
    const { component, dispatch, name, location, settings, description } = this.props;
    let element = null;

    if (component) {
      element = createElement(
        component,
        {
          location,
          settings,
          description,
          dispatch: (action) => {
            action.type = `EXTENSION_${name.toUpperCase()}_${action.type}`;

            return dispatch(action);
          }
        }
      );
    }

    return (
      <div className={classNamespace('content')}>
        {element}
      </div>
    );
  }

  render () {
    const { name, location } = this.props;
    const qs = queryString.parse(location.search);
    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'expand')]: qs.extension === name
    });
    

    return (
      <div className={classes} onClick={this.onItemClick}>
        {this.metaRender()}
        {this.contentRender()}
      </div>
    );
  }
}