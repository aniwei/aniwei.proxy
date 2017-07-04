import React, { createElement } from 'react';
import classnames from 'classnames';
import { register } from 'controls-context';

// import './less/index.less';

import Logo from './logo';
import Search from './search';
import Menu from './menu';

// const menus = [
//   {key: 'send', route: 'list', text: '请求数据', active: false, component: List},
//   {key: 'app', route: 'extensions', text: '设置', active: false, component: Extensions},
//   {key: 'setting', route: 'settings', text: '设置', active: false, component: Settings}  
// ];

class Navigator extends React.Component {
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

export default register({}, Navigator);