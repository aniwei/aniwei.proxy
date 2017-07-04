import React, { createElement, cloneElement } from 'react';
import classnames from 'classnames';

import { namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-editor');

export default class Text extends React.Component {
  render () {
    const { className, multiLine, type, rows, cols, name, id, placeholder } = this.props;

    const element = multiLine ? <textarea /> : <input/>;
    const classes = classnames({
      [classNamespace('text')]: true,
      [classNamespace('multiline-text')]: !!multiLine,
      [className]: !!className
    });
    const props = {
      className: classes,
      placeholder,
      id,
      name
    };

    if (multiLine) {
      props.rows = rows || 8;
      props.cols = cols;
    } else {
      props.type = type;
    }

    return (
      cloneElement(element, props)
    );
  }
}