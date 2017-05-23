import React from 'react';
import classnames from 'classnames';

import './less/index.less';

import Logo from './logo';
import Search from './search';
import Menu from './menu';

export default class Navigator extends React.Component {
  render () {
    const { className, menus } = this.props;

    const classes = classnames({
      [className]: !!className
    });

    return (
      <div className={className}>
        <Logo />
        <Menu list={menus} />
      </div>
    );
  }
}