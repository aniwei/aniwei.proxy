import React, { createElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { clone } from 'lodash';
import { register, namespace, Components } from 'aniwei-proxy-extension-context';
import { Link } from 'react-router-dom';

import './less/index.less';
import 'whatwg-fetch';

const classNamespace = namespace('sim');
const { Navigation, View, Editor } = Components;

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
            { value: '1', text: '正则表达式' },
            { value: '2', text: '字符串' }
          ],
          defaultProps: {}
        }, {
          type: 'input',
          value: '1',
          name: 'content',
          options: [
            { value: '1', text: '字符批评' },
            { value: '2', text: '正则匹配' }
          ],
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
          value: '',
          name: 'type',
          options: [
            { value: '1', text: '' },
            { value: '2', text: '字符串' }
          ],
          defaultProps: {}
        }, {
          type: 'input',
          value: '1',
          name: 'content',
          options: [
            { value: '1', text: '字符批评' },
            { value: '2', text: '正则匹配' }
          ],
          defaultProps: {
            multiLine: true,
            placeholder: '请输入匹配规则'
          }
        }]
      }
    ]
  }
}

class Simulator extends React.Component {
  onRuleSubmit = () => {

  }

  onAppenderClick = () => {
    const { dispatch } = this.props;
    const form = dataFormatter();

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onRuleSubmit,
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

  onNavigationItemClick (item, e) {
    const { dispatch, settings, location } = this.props;
    const { navigations } = settings;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    dispatch({
      type: 'EXTENSION_HOST_TAB_CHANGE',
      navigations
    });

    switch (item.action) {
      case 'HELPFUL':
        fetch('/plugin/host/README.md')
          .then(res => res.text())
          .then(res => {
            dispatch({
              type: 'LAYER_OVERLAYED',
              component: Helpful,
              defaultProps: {
                html: res
              } 
            });

            window.location.href = `#${location.pathname}?${queryString.stringify(qs)}`;
          });

        break;
        
      default:
        navigations.list.forEach(nav => nav.selected = false);
        navigations.selected = item.key;
        item.selected = !item.selected;
        break;
    }
  }

  render () {
    return (
      <div className={classNamespace()}>
        {this.navigationRender()}
        {this.listviewRender()}
        {this.appenderRender()}
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