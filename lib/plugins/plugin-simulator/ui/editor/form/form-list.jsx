import React, { createElement, cloneElement } from 'react';
import { namespace } from 'aniwei-proxy-extension-context';
import classnames from 'classnames';

const classNamespace = namespace('sim-editor');

export default class Listview extends React.Component {
  render () {
    const { className } = this.props;

    const classes = classnames({
      [classNamespace('listview')]: true,
      [className]: !!className
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}