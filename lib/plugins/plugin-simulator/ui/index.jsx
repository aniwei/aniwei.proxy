import React, { createElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { clone } from 'lodash';
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
        name: 'name',
        list: {
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
        name: 'match',
        list: [{
          type: 'select',
          value: '',
          name: 'type',
          options: [
            { value: 'regexp', text: '正则表达式' },
            { value: 'string', text: '字符串' }
          ],
          defaultProps: {}
        }, {
          type: 'input',
          value: 'regexp',
          name: 'content',
          defaultProps: {
            multiLine: true,
            placeholder: '请输入匹配规则'
          }
        }]
      }, {
        title: '规则响应',
        desc: '规则格式: (#?) 127.0.0.1 localhsot local.com',
        name: 'response',
        list: [{
          type: 'select',
          value: 'service',
          name: 'type',
          options: [
            { value: 'service', text: '服务' },
            { value: 'file', text: '本地文件' },
            { value: 'code', text: '自定义' }
          ],
          defaultProps: {}
        }, {
          type: 'input',
          value: '',
          name: 'content',
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
    debugger;
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

  onAppenderClick = () => {
    const { dispatch } = this.props;
    const form = dataFormatter();

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onRuleSubmit,
        onChange: this.onChange,
        form
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

  navigationRender () {
    const { settings, } = this.props;
    const { navigations } = settings;

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
  ['UPDATE_LIST']: (state, action) => {
    let ext;

    state.some((e) => {
      if (e.name === 'simulator') {
        return ext = e;
      }
    });

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