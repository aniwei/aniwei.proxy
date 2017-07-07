import React, { createElement, PropTypes, Component } from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import { assign } from 'lodash';
import { clone } from 'lodash';
import { Link } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace, Components } from 'aniwei-proxy-extension-context';


import './less/index.less';

import Editor from './editor';
import Rules from './rules';
import Helpful from './helpful';

const { Navigation, View } = Components;
const classNamespace = namespace('host');

class Host extends Component {
  onRuleAppended = (rule) => {
    const { settings, dispatch } = this.props;
    const { rules } = settings;
    
    rules[rules.length] = rule;
    
    this.rulesUpdate(rules);
  }

  onRuleUpdated (rule, index) {
    const { settings } = this.props;
    const { rules } = settings;

    rules[index] = rule;

    this.rulesUpdate(rules);
  }

  onAppenderClick = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onRuleAppended
      }
    });
  }

  onNavigationItemClick = (item, e) => {
    const { dispatch, settings, location } = this.props;
    const { navigations } = settings;

    if (item.action === 'HELPFUL') {
      return fetch('/plugin/host/README.md')
        .then(res => res.text())
        .then(res => {
          dispatch({
            type: 'LAYER_OVERLAYED',
            component: Helpful,
            defaultProps: {
              html: res
            } 
          });

          const qs = queryString.parse(location.search);
          qs.layer = 'visiable';

          window.location.href = `#${location.pathname}?${queryString.stringify(qs)}`;
        });
    }

    navigations.list.forEach(nav => nav.selected = false);
    navigations.selectedKey = item.key;
    item.selected = !item.selected;

    dispatch({
      type: 'EXTENSION_HOST_TAB_CHANGE',
      navigations
    });
  }

  rulesEditer = (rule, index) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: assign({
        onSubmit: (rule) => {
          this.onRuleUpdated(rule, index);
        }
      }, rule)
    });
  }

  rulesUpdate (rules) {
    const { dispatch } = this.props;

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

  settingsRender () {

  }

  viewsRender () {
    const { settings } = this.props;
    const { navigations } = settings;
    const { selectedKey } = navigations;

    return (
      <View selectedKey={selectedKey}>
        <View.Item key="rules">
          {this.listviewRender()}
          {this.appenderRender()}
        </View.Item>
        <View.Item key="settings">
          {this.settingsRender()}
        </View.Item>
      </View>
    );
  }

  navigationRender () {
    const { settings, } = this.props;
    const { navigations } = settings;

    return (
      <Navigation list={navigations.list} onSelect={this.onNavigationItemClick} />
    );
  }

  render () {
    return (
      <div className={classNamespace()}>
        {this.navigationRender()}
        {this.viewsRender()}
      </div>
    );
  }
}

const reducers = {
  [`RULE_UPDATE`]: (state, action) => {
    return clone(state);
  },

  [`TAB_CHANGE`]: (state, action) => {
    return clone(state);
  }
};


export default register(reducers)('host', Host);