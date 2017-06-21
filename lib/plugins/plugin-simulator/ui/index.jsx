import React, { createElement } from 'react';
import { register, namespace } from 'aniwei-proxy-extension-context';

import Tag from './tag';

import './less/index.less';
import 'whatwg-fetch';

const classNamespace = namespace('sim');

class Simulator extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props;

    fetch(`/plugin/simulator/list`)
      .then(res => res.json())
      .then(res => dispatch({
        type: 'UPDATE_LIST',
        list: res.list
      }));
  }

  tagRender () {
    const { list } = this.props;

    return list.map((li, index) => {
      return (
        <Tag key={li.subject} text={li.name} />
      );
    });
  }

  groupRender () {
    const { list } = this.props;
  }

  render () {
    return (
      <div className={classNamespace()}>
        {this.tagRender()}
      </div>
    );
  }
}

const reducers = {
  ['UPDATE_LIST']: (state, action) => {
    debugger;
  }
};

export default register(reducers)('simulator', Simulator);