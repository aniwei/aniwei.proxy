import React, { createElement, cloneElement } from 'react';
import classnames from 'classnames';
import { namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('host-rules');
const noop = () => {};

export default class Button extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    onClick: noop 
  }

  onButtonClick = (e) => {
    const { onClick } = this.props;

    onClick(e);
  }

  render () {
    const { className, type, disable } = this.props;

    const classes = classnames({
      [classNamespace('button')]: true,
      [classNamespace('button', type || 'default')]: true,
      [classNamespace('button', 'disable')]: !!disable,
      [className]: !!className
    });

    return (
      <div className={classes} onClick={this.onButtonClick}>
        {this.props.children}
      </div>
    );
  }
}