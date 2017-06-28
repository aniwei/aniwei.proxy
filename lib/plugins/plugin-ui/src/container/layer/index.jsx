import React, { createElement } from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom';

import util from '../../util';
import './less/index.less';

const classNamespace = util.namespace('app__layer');

class Layer extends React.Component {
  titleRender () {
    const { title } = this.props;

    if (title) {
      return (
        <div className={classNamespace('title')}>
          {title}
        </div>
      );
    }
  }

  render () {
    const { location, component } = this.props;
    const qs = queryString.parse(location.search);

    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'overlayed')]: qs.layer === 'visiable'
    });

    delete qs.layer;
    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    let element;


    if (component) {
      element = createElement(component, this.props);
    }

    if (!component) {
      element = <Redirect to={`${location.pathname}?${queryString.stringify(qs)}`} />;
    }

    return (
      <div className={classes}>
        <div className={classNamespace('inner')}>
          <Link to={uri}>
            <i className={classnames({
              [classNamespace('close-icon')]: true,
              ['iconfont']: true, 
              ['icon-close']: true
            })}></i>
          </Link>
          {/*{this.titleRender()}*/}
          <div className={classNamespace('content')}>
            {element}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { layer } = state;

  return layer;
}

export default connect(mapStateToProps)(withRouter(Layer));