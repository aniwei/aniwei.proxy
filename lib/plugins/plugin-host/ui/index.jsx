import React, { createElement, PropTypes, Component } from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import { assign } from 'lodash';
import { clone } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace, Components } from 'aniwei-proxy-extension-context';


import './less/index.less';

// import Editor from './editor';


const { Navigation, View, Rule, Helper, Editor } = Components;
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
      const qs = queryString.parse(location.search);
      qs.layer = 'visiable';

      window.location.href = `#${location.pathname}?${queryString.stringify(qs)}`;

      return dispatch({
        type: 'LAYER_OVERLAYED',
        component: Helper,
        defaultProps: {
          src: '/plugin/host/README.md'
        } 
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

  singleRuleUpdate () {
    const { dispatch, settings } = this.props;
    const { rules } = settings;

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
    .then(res => dispatch({
      type: 'EXTENSION_HOST_RULE_UPDATE'
    }));
  }

  rulesUpdate () {
    const { dispatch, rules } = this.props;

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

  onRuleSelect = (rule, index) => {
    rule.disable = !rule.disable;

    this.singleRuleUpdate();
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
    const { rules } = settings;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;
    let element;

    if (
      rules && 
      rules.length > 0
    ) {
      const props = {
        list: rules,
      };

      element = <Rule {...props} onSelect={this.onRuleSelect} />;
    }

    return (
      <div className={classNamespace('rules')}>
        {element}
      </div>
    );
  }

  settingsRender () {
    return (
      <div>
        Hello World
      </div>
    );
  }

  viewsRender () {
    const { settings } = this.props;
    const { navigations } = settings;
    const { selectedKey } = navigations;

    const form = {
      button: {
        loading: true,
        text: '提交'
      },
      subjects: [
        {
          title: '规则名称',
          desc: '这是规则说明',
          name: 'group',
          list: {
            type: 'input',
            name: 'name',
            required: true,
            value: 'hello world',
            defaultProps: {
              type: 'text',
              placeholder: 'hello'
            }
          }
        },
        {
          title: '规则名称',
          desc: '这是规则说明',
          name: 'rule',
          list: [{
            type: 'select',
            name: 'name',
            text: '匹配类型',
            required: true,
            value: 'hello',
            options: [
              { text: '选项 1', value: 1 },
              { text: '选项 2', value: 2 },
              { text: '选项 3', value: 3 }
            ],
            defaultProps: {

            }
          }, {
            type: 'input',
            name: 'name',
            required: true,
            value: 'hello world',
            defaultProps: {
              type: 'text',
              multiLine: true,
              placeholder: 'hello'
            }
          }]
        }
      ]
    }

    return (
      <View selectedKey={selectedKey}>
        <View.Item key="rules">
          <Editor form={form} />

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