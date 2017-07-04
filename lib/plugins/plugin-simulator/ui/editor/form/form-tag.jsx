import React, { createElement, Component, PropTypes } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';


const classNamespace = namespace('form');
const noop = () => {};

export default class FormGroup extends Component {
  static propTypes = {
    text: PropTypes.string,
    selected: PropTypes.bool,
    onSelected: PropTypes.func,
    onDeselect: PropTypes.func
  };

  static defaultProps = {
    onSelected: noop,
    onDeselect: noop
  };

  onTagClick = (e) => {
    const { selected, key } = this.props;

    selected ? onDeselect(key, e) : onSelected(key, e);
  }

  render () {
    const { text, selected, key } = this.props;
    const classes = classnames({
      ['iconfont icon-close']: true,
      [classNamespace('tag-close-icon')]: true
    });
    const tagClasses = classnames({
      [classNamespace('tag')]: true,
      [classNamespace('tag', 'selected')]: !!selected,
    });

    return (
      <div className={tagClasses} onClick={this.onTagClick}>
        <i className={classes}></i>
        <div className={classNamespace('tag-text')}>
          {text}
        </div>
      </div>
    );
  }
}

