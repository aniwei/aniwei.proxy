import React, { createElement, PropTypes, Component } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace } from 'aniwei-proxy-extension-context';

import './less/index.less';

import Rules from './rules';

const classNamespace = namespace('host');

class Host extends Component {
  actionRender () {
    const { location, settings } = this.props;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;
    let element;

    if (
      settings.rules && 
      settings.rules.length > 0
    ) {
      element = <Rules rules={settings.rules} />;
    }

    return (
      <div className={classNamespace('action')}>
        {element}
      </div>
    );
  }

  render () {
    return (
      <div className={classNamespace()}>
        {this.actionRender()}
      </div>
    );
  }
}

const reducers = {
  [`UPDATE`]: () => {}
};


export default register(reducers)('host', Host);