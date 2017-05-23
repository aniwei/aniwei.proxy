import React, { Component, cloneElement, Children, PropTypes } from 'react';
import classnames from 'classnames';

import './less/index.less';
import TabPane from './pane';

const noop = () => {};

class Tab extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onChange: PropTypes.func
  };

  static defaultProps = {
    onClose: noop,
    onChange: noop
  };

  constructor () {
    super();

    this.state = {
      activedKey: null
    };
  }

  onSelect = (key) => {
    const { onChange } = this.props;

    if (key === this.state.activedKey) {
      return this;
    }

    this.setState({
      activedKey: key
    });

    if (typeof onChange === 'function') {
      onChange(key)
    }
  }

  onClose = (key, e) => {
    const { onClose, children } = this.props;
    const childKeys = Children.map(children, (child) => child.key);
    const index = childKeys.indexOf(key);
    let activedKey;

    if (key === this.state.activedKey) {
      if (index === childKeys.length - 1) {
        activedKey = childKeys[childKeys.length - 2];
      } else {
        activedKey = childKeys[index + 1];
      }
    }

    if (childKeys.length === 1) {
      this.setState({
        activeKey: null
      });
    } else {
      if (activedKey) {
        this.setState({
          activedKey
        });
      }
    }

    onClose(key, e);

    e.stopPropagation();
  }

  tabsRender () {
    const { children, defaultActivedKey, className, onClose } = this.props;

    if (this.state.activeKey === null) {
      if (defaultActivedKey) {
        this.state.activeKey = defaultActivedKey;
      }
    }

    const content = [];
    const tabs = Children.map(children, (child, index) => {
      const key = child.key || index;
      let actived = false;

      if (this.state.activedKey) {
        actived = this.state.activedKey === key;
      } else {
        this.state.activedKey = key;
        actived = true;
      }

      return cloneElement(child, {
        key,
        index: key,
        onSelect: this.onSelect,
        onClose: (e) => this.onClose(key, e),
        actived
      });
    });    

    const classes = classnames({
      ['app__tabs']: true,
      className: !!className
    });

    return (
      <div className="app__tabs">
        <div className="app__tabs-panes clearfix">
          {tabs}
        </div>
      </div>
    );
  }


  render () {
    return this.tabsRender();
  }
}

Tab.TabPane = TabPane;

export default Tab;

