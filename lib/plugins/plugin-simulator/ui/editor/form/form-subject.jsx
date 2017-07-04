import React, { createElement, cloneElement } from 'react';
import { namespace } from 'aniwei-proxy-extension-context';
import classnames from 'classnames';

const classNamespace = namespace('sim-editor');

export default class Subject extends React.Component {

  titleRender () {
    const { title } = this.props;

    if (title) {
      return (
        <div className={classNamespace('title')}>{title}</div>
      );
    }
  }

  render () {
    const { className, required, title } = this.props;

    const classes = classnames({
      [classNamespace()]: true,
      [className]: !!className
    });

    return (
      <div className={classes}>
        {this.titleRender()}
        {this.props.children}
      </div>
    );
  }
}