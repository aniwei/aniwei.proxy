import React, { createElement } from 'react';
import classnames from 'classnames';

import SlimScroll from 'slim-scroll';
import util from '../../util';
import './less/index.less';
import 'slim-scroll/'

const classNamespace = util.namespace('app__scroll');

export default class Scroll extends React.Component {
  onWindowResize = () => {
    if (this.scroll) {

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.scroll.resetValues();
      }, 50);
    }
  }

  componentDidMount () {
    const scroll = this.refs.scroll;

    // if (scroll) {
    //   if (navigator.userAgent.indexOf('Mac OS X') === -1) {
    //     this.scroll = new SlimScroll(scroll, {
    //       wrapperClass: classnames({
    //         [classNamespace('wrapper')]: true,
    //         [classNamespace(null, 'unselectable')]: true,
    //         [classNamespace(null, 'mac')]: true,
    //       }),
    //       scrollBarContainerClass: classNamespace('bar-wrapper'),
    //       scrollBarContainerSpecialClass: classNamespace(null, 'animate'),
    //       scrollBarClass: classNamespace('bar'),
    //       keepFocus: true
    //     });

    //     window.addEventListener('resize', this.onWindowResize, false);
    //     this.onWindowResize();
    //   }
    // }
  }

  componentWillUnmount () {
    if (this.scroll) {
      window.removeEventListener('resize', this.onWindowResize, false);
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('fresh' in nextProps) {
      if (this.scroll) {
        this.scroll.resetValues();
      }
    }
  }

  render () {
    const { className } = this.props;
    const classes = classnames({
      [classNamespace()]: true,
      [className]: !!className
    });

    return (
      <div className={classes} ref="scroll">
        {this.props.children}
      </div>
    );
  }
}
