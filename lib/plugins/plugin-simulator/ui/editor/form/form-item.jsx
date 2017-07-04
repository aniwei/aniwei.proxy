import React, { createElement, cloneElement } from 'react';
import classnames from 'classnames';
import { namespace } from 'aniwei-proxy-extension-context';


const classNamespace = namespace('sim-editor');


class Body extends React.Component {
  render () {
    const { className } = this.props;

    const classes = classnames({
      [classNamespace('item-body')]: true,
      [className]: !!className
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class Header extends React.Component {
  render () {
    const { className } = this.props;

    const classes = classnames({
      [classNamespace('item-header')]: true,
      [className]: !!className
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

export default class Item extends React.Component {
  static Header = Header;
  static Body = Body;

  render () {
    const { className, type, vertical } = this.props;

    const classes = classnames({
      [classNamespace('item')]: true,
      [classNamespace('vertical-item')]: !!vertical,
      [classNamespace(`${type}-item`)]: !!type,
      [className]: !!className
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}