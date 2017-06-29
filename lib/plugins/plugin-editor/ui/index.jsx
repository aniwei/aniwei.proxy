import React, { createElement } from 'react';
import { register, namespace } from 'aniwei-proxy-extension-context';


import 'whatwg-fetch';

class Requester extends React.Component {

  render () {
    const { settings } = this.props;

    console.log(settings)

    return (
      <div>

      </div>
    );
  }
}

const reducers = {
  [`RULE_UPDATE`]: (state, action) => {
    return clone(state);
  }
};


export default register(reducers)('requester', Requester);