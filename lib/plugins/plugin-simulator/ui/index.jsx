import React, { createElement } from 'react';
import queryString from 'query-string';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';
import { Link } from 'react-router-dom';

import Tag from './tag';
import Editor from './editor';
import Rule from './rule';

import './less/index.less';
import 'whatwg-fetch';

const classNamespace = namespace('sim');

class Simulator extends React.Component {
  onAppenderClick = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor
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
  }
};

export default register(reducers)('simulator', Simulator);