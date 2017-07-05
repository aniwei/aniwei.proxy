import React, { createElement } from 'react';
import classnames from 'classnames';
import { namespace } from 'aniwei-proxy-extension-context';
import 'whatwg-fetch';

import Group from './group';

const classNamesapce = namespace('host-rules');

export default class Rules extends React.Component {
  onItemSelect = (rule, index, li) => {
    const { dispatch, rules } = this.props;

    li.disable = !li.disable;
    
    this.updateRules(rules);
  }

  onGroupRemove = (index) => {
    const { dispatch, rules } = this.props;

    rules.splice(index, 1);

    this.updateRules(rules);
  }

  onGroupEdit = (rule, index) => {
    const { rulesEditer } = this.props;

    rulesEditer(rule, index);
  }

  updateRules (rules) {
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
    .then(res => dispatch({
      type: 'EXTENSION_HOST_RULE_UPDATE'
    }));
  }

  groupRender () {
    const { rules, location } = this.props;

    return rules.map((li, index) => {
      const { text, list, name } = li;
      const props = {
        list,
        text,
        name,
        index,
        location,
        onGroupEdit: () => this.onGroupEdit(li, index),
        onGroupRemove: () => this.onGroupRemove(index),
        onItemSelect: (l) => this.onItemSelect(li, index, l)
      }

      return (
        <Group {...props} key={index}/>
      );
    });
  }

  render () {
    return (
      <div className={classNamesapce()}>
        {this.groupRender()}
      </div>
    );
  }
}