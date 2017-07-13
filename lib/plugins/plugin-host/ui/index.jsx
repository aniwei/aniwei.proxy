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
        name: 'list',
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
    const { form } = res;
    const json = res.json();

    if (form.type === 'append') {
      this.onRuleAppended(json);
    } else {
      this.onRuleUpdated(json, form.index);
    }
  }

  valueSetter = (name, subject) => {
    switch (name) {
      case 'list':
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

        return `${disable}${li.key}     ${li.value.join('  ')}`;
      }).join('\n');
    }

    return content || '';
  }

  valueGetter = (name, subject) => {
    switch (name) {
      case 'list':
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

          if (firstValue.indexOf('#') === 0) {
            disable = true;

            firstValue = firstValue.slice(1);
          }

          if (rip.test(firstValue)) {
            const hostname = valueSplit.filter(v => v.trim());

            if (hostname.length > 0) {
              let li;

              if(!list.some((l) => {
                if (
                  l.key === firstValue && 
                  l.disable === disable &&
                  l.value.sort().toString() === hostname.sort().toString()
                ) {
                  return li = l;
                }
              })) {
                list.push({
                  key: firstValue,
                  value: hostname,
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
    
    this.rulesSender(rules, () => history.back());
  }

  onRuleUpdated (rule, index) {
    const { settings } = this.props;
    const { rules } = settings;

    rules[index] = rule;

    this.rulesSender(rules, () => history.back());
  }

  onRuleRemove = (rule, index) => {
    const { settings } = this.props;
    const { rules } = settings;

    rules.splice(index, 1);

    this.rulesSender(rules, () => history.back());
  }

  onRuleSelect = (rule, index) => {
    const { settings } = this.props;
    const { rules } = settings;
    rule.disable = !rule.disable;

    this.rulesSender(rules);
  }

  onRuleEdit = (rule, index) => {
    const { dispatch, location } = this.props;
    const { router } = this.context;
    const form = dataFormatter();
    const qs = queryString.parse(location.search);
    const history = router.history;

    form.button.text = '更新规则';
    form.type = 'edit';
    form.index = index;

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
            li.value = rule.name;
            break;

          case 'list':
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

  onAppenderClick = () => {
    const { dispatch } = this.props;
    const form = dataFormatter();

    form.type = 'append';

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
    const { dispatch, defaultSettings, location } = this.props;
    const { router } = this.context;
    const { history } = router;
    const { navigations } = defaultSettings;

    if (item.action === 'HELPFUL') {
      const qs = queryString.parse(location.search);
      qs.layer = 'visiable';


      history.push(`${location.pathname}?${queryString.stringify(qs)}`);

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

  rulesSender (rules, callback) {
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

      if (typeof callback === 'function') {
        history.back();
      }
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

      element = <Rule {...props} onSelect={this.onRuleSelect} onEdit={this.onRuleEdit} onRemove={this.onRuleRemove} />;
    }

    return (
      <div className={classNamespace('rules')}>
        {element}
      </div>
    );
  }

  settingsRender () {
    const props = {
      list: [
        
      ]
    }

    return (
      <div className={classNamespace('settings')}>
        <Rule editable={false} {...props} onSelect={this.onRuleSelect} />;
      </div>
    );
  }

  viewsRender () {
    const { defaultSettings } = this.props;
    const { navigations } = defaultSettings;
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
    const { defaultSettings } = this.props;
    const { navigations } = defaultSettings;

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