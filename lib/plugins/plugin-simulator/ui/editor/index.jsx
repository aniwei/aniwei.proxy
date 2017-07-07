import React, { createElement, PropTypes } from 'react';
import { clone } from 'lodash';
import { namespace } from 'aniwei-proxy-extension-context';

import FormItem from './form-item';
import Button from './button';

import 'whatwg-fetch';

const classNamespace = namespace('sim-editor');
const noop = () => {};

class Editor extends React.Component {
  static propTypes = {
    rule: PropTypes.array
  };

  static defaultProps = {
    rule: []
  }

  onSubmit = (e) => {
    const { rule } = this.props;

    fetch(`/plugin/simulator/append`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rule
      })
    })
    .then(res => res.json())
    .then(() => {
      debugger;
    });
  }

  render () {
    const { rule } = this.props;

    return (
      <div className={classNamespace()}>
        <FormItem dataSource={rule} />
        <Button onClick={this.onSubmit} type="primary">
          添加规则
        </Button>
      </div>
    );
  }
}

export default Editor;