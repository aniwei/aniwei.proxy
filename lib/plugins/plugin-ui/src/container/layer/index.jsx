import React, { createElement } from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import iScroll from 'iscroll';
import Scroll from 'react-iscroll';
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
    const { location, component, data, title } = this.props;
    const qs = queryString.parse(location.search);

    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'overlayed')]: qs.layer === 'visiable'
    });

    delete qs.layer;
    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    let element;

    if (component) {
      element = createElement(component, data);
    }

    if (!component) {
      element = <Redirect to={queryString.stringify(qs)} />;
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
          {this.titleRender()}
          <Scroll ref="iscroll" iScroll={iScroll} options={{ mouseWheel: true, click: true }}>
            <div className={classNamespace('content')}>
              {element}
            </div>
          </Scroll>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { layer } = state;

  return {
    component: layer.component,

  }
}

export default connect(mapStateToProps)(withRouter(Layer));