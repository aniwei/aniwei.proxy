import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';


import 'whatwg-fetch';

class Requester extends React.Component {
  componentDidMount () {
    this.sizeUpdate();
  }

  componentWillRecevieProps (nextProps) {
    this.sizeUpdate();
  } 

  shouldComponentUpdate () {
    return true;
  } 

  sizeUpdate () {
    const { dispatch } = this.props;

    fetch('/plugin/requester/size')
      .then(res => res.json())
      .then(res => dispatch({
        type: 'EXTENSION_REQUESTER_SIZE_UPDATE',
        size: res.size
      }));
  }

  render () {
    const { settings } = this.props;
    const { size } = settings;

    return (
      <div>
        {size}
      </div>
    );
  }
}

const reducers = {
  [`SIZE_UPDATE`]: (state, action) => {
    let component;

    state.some((cmp) => {
      if (cmp.name === 'requester') {
        return component = cmp;
      }
    });

    const { settings } = component;

    settings.size = action.size;

    return clone(state);
  }
};


export default register(reducers)('requester', Requester);