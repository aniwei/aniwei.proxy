import React, { createElement, PropTypes, Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace } from 'aniwei-proxy-extension-context';

import Button from './button';

const classNamespace = namespace('host-rules-editor');

export default class Editor extends React.Component {
  constructor (props) {
    super(props);    

    const { list, name, text } = props;
    
    this.state = {
      inputValue: text || name,
      textareaValue: this.toTextareaValue(list)
    };
  }

  componentWillReceiveProps (nextProps) {
    const state = {};

    if (
      'text' in nextProps ||
      'name' in nextProps
    ) {
      state.inputValue = nextProps.text || nextProps.name;
    } else {
      state.inputValue = '';
    }

    if ('list' in nextProps) {
      state.textareaValue = this.toTextareaValue(nextProps.list);
    } else {
      state.textareaValue = '';
    }

    this.setState(state);
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { inputValue, textareaValue } = this.state;
    const { name, text, list, onSubmit } = this.props;

    if (!(
      nextState.inputValue === inputValue &&
      nextState.textareaValue === textareaValue
    )) {
      return true;
    }

    if (
      nextProps.name === name &&
      nextProps.text === text &&
      nextProps.list === list &&
      nextProps.onSubmit === onSubmit
    ) {
      return false;
    }

    return true;
  }

  onButtonClick = () => {
    const { onSubmit, list } = this.props;
    const rule = {
      text: this.state.inputValue,
      name: this.state.inputValue,
      list: []
    };

    rule.list = this.json();

    if (
      rule.name &&
      rule.list.length > 0
    ) {
      onSubmit(rule);
    }
  }

  onNameChange = (e) => {
    const value = e.target.value;

    this.setState({
      inputValue: value
    });
  }

  onTextChange = (e) => {
    const value = e.target.value || '';

    this.setState({
      textareaValue: value
    });
  }

  toTextareaValue (list) {
    let content;

    if (Array.isArray(list)) {
      content = list.map((li) => {
        const disable = li.disable ? '# ' : '';

        return `${disable}${li.ip}     ${li.hostname.join('  ')}`;
      }).join('\n');
    }

    return content || '';
  }

  json () {
    const value = this.state.textareaValue || '';
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

  rulesRender () {
    const { textareaValue } = this.state;

    return (
      <div className={classNamespace('text')}>
        <textarea 
          className={classNamespace('textarea')} 
          cols="30" 
          rows="10" 
          onChange={this.onTextChange}
          placeholder="请输入规则"
          value={textareaValue || ''}>
        </textarea>
      </div>
    );
  }

  render () {
    const { text, name,  group } = this.props;
    const { inputValue } = this.state;
    const buttonText = name ? '更新规则' : '添加规则';

    return (
      <div className={classNamespace()}>
        <div className={classNamespace('form')}>
          <div className={classNamespace('header')}>
            <div className={classNamespace('name')}>
              分组
            </div>
            <div className={classNamespace('value')}>
              <input onChange={this.onNameChange} value={inputValue} type="text" className={classNamespace('input')} placeholder="请输入分组名称" />
            </div>
          </div>
          {this.rulesRender()}
        </div>
        <Button type="primary" onClick={this.onButtonClick}>{buttonText}</Button>
      </div>
    );
  };
}