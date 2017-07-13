import React, { createElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { clone, assign } from 'lodash';
import { register, namespace, Components } from 'aniwei-proxy-extension-context';
import { Link } from 'react-router-dom';

import './less/index.less';
import 'whatwg-fetch';

const classNamespace = namespace('sim');
const { Navigation, View, Editor, Helper, Rule } = Components;

const dataFormatter = () => {
  return {
    button: {
      primary: true,
      text: '添加规则'
    },
    subjects: [
      {
        title: '规则名称',
        list: {
          name: 'name',
          type: 'input',
          required: true,
          value: '接口',
          defaultProps: {
            type: 'text',
            placeholder: '请输入规则名称'
          }
        }
      },
      {
        title: '匹配规则',
        desc: '规则格式: (#?) 127.0.0.1 localhsot local.com',
        list: [{
          type: 'select',
          value: 'string',
          name: 'matchType',
          options: [
            { value: 'regular', text: '正则表达式' },
            { value: 'string', text: '字符串' }
          ],
          defaultProps: {}
        }, {
          type: 'input',
          value: '',
          name: 'matchContent',
          defaultProps: {
            multiLine: true,
            placeholder: '请输入匹配规则'
          }
        }]
      }, {
        title: '规则响应',
        desc: '规则格式: (#?) 127.0.0.1 localhsot local.com',
        list: [{
          type: 'select',
          value: 'service',
          name: 'responseType',
          options: [
            { value: 'service', text: '服务地址' },
            { value: 'input', text: '文件地址' },
            { value: 'defined', text: '自定义' }
          ],
          defaultProps: {}
        }, {
          type: 'input',
          value: '',
          name: 'responseContent',
          defaultProps: {
            multiLine: true,
            placeholder: '请输入响应内容'
          }
        }]
      }
    ]
  }
}

class Simulator extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  onRuleSubmit = (res) => {
    const json = res.json();
    const rule = {
      name: json.name,
      list: [
        assign({
          key: json.matchContent,
          value: [json.responseContent],
          match: {
            type: json.matchType,
            content: json.matchContent
          },
          response: {
            type: json.responseType,
            content: json.responseContent
          }
        }, json)
      ]
    };    

    this.onRuleAppended(rule);
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

      list = Array.isArray(list) ? list : [list];

      list.forEach((li) => {
        li.value = rule[li.name] || rule.list[0][li.name];
      });
    });
    
    
    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onRuleSubmit,
        valueGetter: this.valueGetter,
        valueSetter: this.valueSetter,
        form
      }
    });

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    history.push(uri);
  }

  onRuleAppended (rule) {
    const { settings } = this.props;
    const { rules } = settings;

    rules[rules.length] = rule;

    this.rulesSender(rules, () => history.back());
  }

  onChange = (li, value, state, subject, update) => {
    if (subject.name === 'response') {
      if (li.name === 'type') {
        subject.list.some((li) => {
          if (li.name === 'content') {
            return li.type = value;
          }
        });

        state.subjects.some((sub, index) => {
          if (sub.name === 'response') {
            return state.subjects[index] = subject;
          }
        });

        update(state);
      }
    }
  }

  onRuleSelect = (rule, index) => {
    const { settings } = this.props;
    const { rules } = settings;
    rule.disable = !rule.disable;

    this.rulesSender(rules);
  }

  onRuleRemove = (rule, index) => {
    const { settings } = this.props;
    const { rules } = settings;

    rules.splice(index, 1);

    this.rulesSender(rules, () => history.back());
  }

  onAppenderClick = () => {
    const { dispatch } = this.props;
    const form = dataFormatter();

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        valueGetter: this.valueGetter,
        valueSetter: this.valueSetter,
        onSubmit: this.onRuleSubmit,
        onChange: this.onChange,
        form
      }
    });
  }

  valueGetter = (name, subject) => {

    switch (name) {
      case 'responseContent':
        return encodeURIComponent(subject);
      default:
        break;
    }
  }

  valueSetter = (name, subject) => {
    switch (name) {
      case 'responseContent':
        return decodeURIComponent(subject);
      default:
        break;
    }
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

  rulesSender (rules, callback) {
    const { dispatch } = this.props;

    fetch('/plugin/simulator/update', {
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
        type: 'EXTENSION_SIMULATOR_RULE_UPDATE'
      });

      if (typeof callback === 'function') {
        history.back();
      }
    });
  }

  ruleRender () {
    const { settings } = this.props;
    const { rules } = settings;

    const elements = rules.map((li) => {
      return (
        <Rule />
      );
    });

    return (
      <div className={classNamespace('rules')}>

      </div>
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

  navigationRender () {
    const { defaultSettings } = this.props;
    const { navigations } = defaultSettings;

    return (
      <Navigation list={navigations.list} onSelect={this.onNavigationItemClick}/>
    );
  }

  onNavigationItemClick = (item, e) => {
    const { dispatch, settings, location } = this.props;
    const { router } = this.context;
    const { history } = router;
    const { navigations } = settings;

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

  settingsRender () {
    return (
      <div>
        Hello World
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
  ['RULE_UPDATE']: (state, action) => {
    return clone(state);
  },
  ['RULE_CREATE']: (state, action) => {
    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      data: action.data
    });

    return state;
  } 
};

export default register(reducers)('simulator', Simulator);