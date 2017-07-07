import React, { createElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { clone } from 'lodash';
import { register, namespace, Components } from 'aniwei-proxy-extension-context';
import { Link } from 'react-router-dom';

import Editor from './editor';
import Helpful from './helpful';

import './less/index.less';
import 'whatwg-fetch';

const classNamespace = namespace('sim');
const { Navigation, View } = Components;

const rule = [
  { 
    key: 'group', 
    text: '规则名称',
    formItem: [
      { component: 'Name', key: 'group', value: '' }
    ]
  }, {
    key: 'match', 
    text: '匹配规则',
    formItem: [
      { component: 'MatchType', key: 'type', value: '1', options: [
        { name: 'regexp', value: '1', text: '正则表达式'}, 
        { name: 'string', value: '2', text: '字符串'}
      ]},
      { component: 'MatchContent', key: 'content', value: '' }
    ]
  }, {
    key: 'response', 
    text: '响应规则',
    formItem: [
      { component: 'ResponseType', key: 'type', value: '1', options: [
        { name: 'local', value: '1', text: '本地文件'},
        { name: 'service', value: '2', text: '服务'},
        { name: 'json', value: '3', text: '自定义'}
      ]},
      { component: 'ResponseContent', key: 'content', value: '' }
    ]
  }
];

class Simulator extends React.Component {
  onRuleSubmit = () => {

  }

  onAppenderClick = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onRuleSubmit,
        rule
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