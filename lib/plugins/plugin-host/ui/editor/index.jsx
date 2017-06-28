import React, { createElement, PropTypes, Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace } from 'aniwei-proxy-extension-context';

import Button from './button';

const classNamespace = namespace('host-rules-editor');

export default class Editor extends React.Component {
  constructor (props) {
    super(props);    

    const { list } = props;
    let content;

    if (Array.isArray(list)) {
      content = list.map((li) => {
        const disable = li.disable ? '# ' : '';

        return `${disable}${li.ip}     ${li.hostname.join('  ')}`;
      }).join('\n');
    }

    this.state = {
      inputValue: this.props.text || this.props.name,
      textareaValue: content
    };

    this.rule = {};
  }

  componentWillReceiveProps (nextProps) {
    const { list, name, text } = nextProps;
    let content;

    ['text', 'name', 'list'].forEach((key) => {
      this.rule[key] = nextProps[key];
    });

    if (Array.isArray(list)) {
      content = list.map((li) => {
        const disable = li.disable ? '# ' : '';

        return `${disable}${li.ip}     ${li.hostname.join('  ')}`;
      }).join('\n');
    }

    this.setState({
      textareaValue: content,
      inputValue: text || name
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!(
      nextState.inputValue === this.state.inputValue &&
      nextState.textareaValue === this.state.textareaValue
    )) {
      return true;
    }

    if (
      nextProps.name === undefined &&
      nextProps.text === undefined &&
      nextProps.list === undefined
    ) {
      return true;
    }

    if (
      nextProps.name === this.props.name &&
      nextProps.text === this.props.text &&
      nextProps.list === this.props.list &&
      nextProps.onSubmit === this.props.onSubmit
    ) {
      return false;
    }

    return true;
  }

  onButtonClick = () => {
    const { onSubmit } = this.props;
    
    this.rule = {
      text: this.state.inputValue,
      name: this.state.textareaValue,
      list: []
    };

    this.parse();

    onSubmit(this.rule);
  }

  onNameChange = (e) => {
    const value = e.target.value;

    this.setState({
      inputValue: value
    });
  }

  onTextChange = (e) => {
    const value = e.target.value || ''
    clearTimeout(this.timer);

    if (value) {
      this.timer = setTimeout(() => {
        this.setState({
          textareaValue: value
        });
      }, 50);
    }
  }

  parse () {
    const value = this.state.textareaValue || '';
    const valueArray = value.split(/[\n\r]+/g);
    const list = this.rule.list;

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
        <Button type="primary" onClick={this.onButtonClick}>添加规则</Button>
      </div>
    );
  };
}