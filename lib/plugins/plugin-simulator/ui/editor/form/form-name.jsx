import React, { createElement, Component, PropTypes } from 'react';
import classnames from 'classnames';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

import Tag from './tag';

const classNamespace = namespace('form');

export default class FormGroup extends Component {
  static propTypes = {
    title: PropTypes.string,
    list: PropTypes.array
  };

  static defaultProps = {
    list: []
  };

  tagRender () {
    const { list } = this.props;

    return list.map(() => {

    });
  }

  render () {
    const { title, list, selected } = this.props;

    return (
      <div className={classNamespace('subject')}>
        <div className={classNamespace('title')}>
          {title}
        </div>
        <div className={classNamespace('content')}>
          <div className={classNamespace('tags')}>
            {this.tagRender()}
          </div>
        </div>
      </div>
    );
  }
}

