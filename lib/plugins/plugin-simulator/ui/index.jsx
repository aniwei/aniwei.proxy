import React, { createElement } from 'react';
import queryString from 'query-string';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';
import { Link } from 'react-router-dom';

import Editor from './editor';

import './less/index.less';
import 'whatwg-fetch';

const classNamespace = namespace('sim');

const rule = [
  { 
    key: 'group', 
    text: '选择分组',
    formItem: [
      { component: 'Group', key: 'group', value: '' }
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

  onAppenderClick = (rule) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      onSubmit: this.onRuleSubmit,
      rule
    });
  }

  tagRender () {
    const { settings } = this.props;
    const { rules } = settings;

    return rules.map((li, index) => {
      return (
        <Tag key={li.subject} text={li.name} />
      );
    });
  }

  groupRender () {
    const { settings } = this.props;
    const { rules } = settings;
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

  render () {
    return (
      <div className={classNamespace()}>
        {this.appenderRender()}
        {this.ruleRender()}
        {this.tagRender()}
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