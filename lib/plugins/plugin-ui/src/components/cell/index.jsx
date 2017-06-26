import React from 'react';
import classnames from 'classnames';

import './less/index.less';
import util from '../../util';

const dataNamespace = util.namespace('app__cell');

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
      [dataNamespace()]: true,
      [dataNamespace(null, 'expand')]: this.state.expand
    });

    return (
      <div className={classes} onClick={this.onCellClick}>
        <span className={dataNamespace('name')}>{text}</span>
        <span className={dataNamespace('value')}>{value}</span>
      </div>
    );
  }
}
