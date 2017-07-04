import React, { createElement, cloneElement } from 'react';
import classnames from 'classnames';
import { namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-editor');


class Option extends React.Component {
  render () {
    const { className, value } = this.props;

    const classes = classnames({
      [classNamespace('select-options')]: true,
      [className]: !!className
    });

    return (
      <option value={value}>{this.props.children}</option>
    );
  }
}

export default class Select extends React.Component {
  static Option = Option;

  onSelectChange = () => {
    
  }

  render () {
    const { className, name, id } = this.props;
    const props = {
      onChange: this.onSelectChange,
      id,
      name
    };

    const classes = classnames({
      [classNamespace('select')]: true,
      [className]: !!className
    });

    return (
      <select className={classes}>
        {this.props.children}
      </select>
    );
  }
}