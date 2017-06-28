import React, { createElement, PropTypes, Component } from 'react';
import queryString from 'query-string';
import { assign } from 'lodash';
import { clone } from 'lodash';
import { Link } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace } from 'aniwei-proxy-extension-context';

import './less/index.less';

import Editor from './editor';
import Rules from './rules';

const classNamespace = namespace('host');

class Host extends Component {
  onRuleSubmit = (rule) => {
    const { settings, dispatch } = this.props;
    const { rules } = settings;
    
    rules[rules.length] = rule;
    
    fetch('/plugin/host/update', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rules: rules
      })
    })
    .then(res => res.json())
    .then(res => {
      dispatch({
        type: 'EXTENSION_HOST_RULE_UPDATE'
      });

      history.back();
    });
  }

  onAppenderClick = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      onSubmit: this.onRuleSubmit
    });
  }

  rulesEditer = (rule, onSubmit) => {
    const { dispatch } = this.props;

    dispatch(assign({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      onSubmit
    }, rule));
  }

  appenderRender () {
    const { location } = this.props;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    return (
      <Link to={uri} className={classNamespace('appender')} onClick={this.onAppenderClick}>
      </Link>
    );
  }

  listviewRender () {
    const { location, settings, dispatch } = this.props;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;
    let element;

    if (
      settings.rules && 
      settings.rules.length > 0
    ) {
      const props = {
        rules: settings.rules,
        rulesEditer: this.rulesEditer,
        location,
        dispatch
      };

      element = <Rules {...props} />;
    }

    return (
      <div className={classNamespace('listview')}>
        {element}
      </div>
    );
  }

  render () {
    return (
      <div className={classNamespace()}>
        {this.listviewRender()}
        {this.appenderRender()}
      </div>
    );
  }
}

const reducers = {
  [`RULE_UPDATE`]: (state, action) => {
    // let cmpt;

    // state.some((cmp) => {
    //   if (cmp.name === 'host') {
    //     return cmpt = cmp;
    //   }
    // });

    // const { settings } = cmpt;
    // const index = action.index;

    // settings.rules[index] = action.rule;

    return clone(state);
  }
};


export default register(reducers)('host', Host);