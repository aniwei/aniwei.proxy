import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link, Route } from 'react-router-dom';

import util from '../../../util';

const dataNamespace = util.namespace('app__list-item-data');

export default class Cell extends React.Component {
  constructor () {
    super();

    this.state = {
      expand: false
    };
  }

  onCellClick = () => {
    this.setState({
      expand: !this.state.expand
    });
  }

  render () {
    const { text, value } = this.props;
    const classes = classnames({
      [dataNamespace('cell')]: true,
      [dataNamespace('cell_expand')]: this.state.expand
    });

    return (
      <div className={classes} onClick={this.onCellClick}>
        <span className={dataNamespace('cell-name')}>{text}</span>
        <span className={dataNamespace('cell-value')}>{value}</span>
      </div>
    );
  }
}
