import React, { createElement, Component } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import util from '../../util';
import './less/index.less';
import 'whatwg-fetch';

const classNamespace = util.namespace('app__feedback');

class Feedback extends React.Component {

  onSenderClick = () => {
    fetch('/feedback');
  }

  render () {
    const { location } = this.props;
    const { search } = location;

    const qs = queryString.parse(search);

    const happyClass = classnames({
      [classNamespace('face')]: true,
      [classNamespace('happy')]: true
    });

    const unhappyClass = classnames({
      [classNamespace('face')]: true,
      [classNamespace('unhappy')]: true
    });

    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'visiable')]: qs.feedback === 'visiable'
    });

    return (
      <div className={classes}>
        <div className={classNamespace('inner')}>
          <div className={classNamespace('title')}>
            朋友，感觉体验如何？
          </div>
          <div className={classNamespace('content')}>
            <a className={happyClass}></a>
            <a className={unhappyClass}></a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(withRouter(Feedback));