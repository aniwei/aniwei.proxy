import React, { createElement, PropTypes, Component } from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import { assign, cloneDeep } from 'lodash';
import { clone } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace, Components } from 'aniwei-proxy-extension-context';


import './less/index.less';

const { Navigation, View, Rule, Helper, Editor } = Components;
const classNamespace = namespace('host');
const dataFormatter = () => {
  return {
    button: {
      primary: true,
      text: '添加规则'
    },
    subjects: [
      {
        title: '规则名称',
        name: 'name',
        list: {
          type: 'input',
          required: true,
          value: '开发环境',
          defaultProps: {
            type: 'text',
            placeholder: '请输入规则名称'
          }
        }
      },
      {
        title: '规则内容',
        desc: '规则格式: (#?) 127.0.0.1 localhsot local.com',
        name: 'rule',
        list: [{
          type: 'input',
          value: '',
          defaultProps: {
            type: 'text',
            multiLine: true,
            placeholder: '请输入规则内容'
          }
        }]
      }
    ]
  }
}

class Host extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  onSubmit = (res) => {
    const json = res.json();
  }

  valueSetter = (name, subject) => {
    switch (name) {
      case 'rule':
        return this.ruleValueSetter(subject);
      default: 
        break;
    }
  }

  ruleValueSetter (list) {
    let content;

    if (Array.isArray(list)) {
      content = list.map((li) => {
        const disable = li.disable ? '# ' : '';

        return `${disable}${li.ip}     ${li.hostname.join('  ')}`;
      }).join('\n');
    }

    return content || '';
  }

  valueGetter = (name, subject) => {
    switch (name) {
      case 'rule':
        return this.ruleValueGetter(subject.value || '');
      default:
        break;
    }
  }

  ruleValueGetter (value) {
    const valueArray = value.split(/[\n\r]+/g);
    const list = [];

    if (valueArray.length > 0) {
      valueArray.forEach((line) => {
        const lineValue = line.trim() || ''; 
        const valueSplit = line.split(/\s+/g);
        const rip = /(\d+\.){3}\d+/g;
        let firstValue = valueSplit.shift().trim();
        let disable = false;

        if (valueSplit.length > 0) {
          if (firstValue === '#') {
            disable = true;

            firstValue = valueSplit.shift().trim();
          }

          if (rip.test(firstValue)) {
            const hostname = valueSplit.filter(v => v.trim());

            if (hostname.length > 0) {
              let li;

              if(!list.some((l) => {
                if (
                  l.ip === firstValue && 
                  l.disable === disable &&
                  l.hostname.sort().toString() === hostname.sort().toString()
                ) {
                  return li = l;
                }
              })) {
                list.push({
                  ip: firstValue,
                  hostname,
                  disable
                });
              }
            }
          }
        }
      });
    }

    return list;
  }


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
    const form = dataFormatter();

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onSubmit,
        valueGetter: this.valueGetter,
        valueSetter: this.valueSetter,
        form
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

  onRuleEdit = (rule, index) => {
    const { dispatch, location } = this.props;
    const { router } = this.context;
    const form = dataFormatter();
    const qs = queryString.parse(location.search);
    const history = router.history;

    form.button.text = '更新规则';

    form.subjects.forEach((subject) => {
      let list = subject.list;
      let name;

      list = Array.isArray(list) ? list : [list];

      if (list.length === 1) {
        name = subject.name;
      }

      list.forEach((li) => {
        name = name || li.name;

        switch (name) {
          case 'name':
            li.value = rule.text;
            break;

          case 'rule':
            li.value = rule.list;
            break;
        }
      });
    });
    
    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onSubmit,
        valueGetter: this.valueGetter,
        valueSetter: this.valueSetter,
        form
      }
    });

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    history.push(uri);
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

      element = <Rule {...props} onSelect={this.onRuleSelect} onEdit={this.onRuleEdit} />;
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