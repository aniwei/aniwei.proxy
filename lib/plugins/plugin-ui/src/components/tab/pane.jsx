import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const noop = () => {};

class TabPane extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    closeButtonAble: PropTypes.bool
  };

  static defaultProps = {
    onClose: noop,
    closeButtonAble: true
  };

  onClick (key, e) {
    const { onSelect } = this.props;

    if (typeof onSelect === 'function') {
      onSelect(key, e);
    }
  }

  render () {
    const { tab, index, actived, className, fixed, onClose, closeButtonAble } = this.props;

    const classes = classnames({
      ['app__tabs-pane']: true,
      ['app__tabs-pane_active']: actived,
      [`${className}`]: !!className
    });

    let closeElement;

    if (closeButtonAble && !fixed) {
      closeElement = <i className="iconfont icon-close app__tabs-pane-close-icon" onClick={onClose}></i>;
    }

    return (
      <div className={classes}
        title={tab}
        onClick={(e) => this.onClick(index, e)}
      >
        {tab}
        {closeElement}
      </div>  
    );
  }
}

export default TabPane;

