import React, { createElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { namespace } from 'aniwei-proxy-extension-context';
import 'whatwg-fetch';

const classNamesapce = namespace('sim-rules');

export default class Rules extends React.Component {
  constructor () {
    super();

    this.state = {
      toggled: false
    };
  }

  onTitleClick = () => {
    const { toggled } = this.state;

    this.setState({
      toggled: !toggled
    });
  }

  listRender () {
    const { onItemSelect, list, index } = this.props;

    return list.map((li, i) => {
      const { ip, hostname, disable } = li;
      const spanElement = hostname.map((name, idx) => <span className={classNamesapce('name')} key={idx}>{name}</span>);
      const classes = classnames({
        [classNamesapce('item')]: true,
        [classNamesapce('item', 'enable')]: !disable
      });

      return (
        <div className={classes} onClick={() => onItemSelect(li)} key={i}>
          <div className={classNamesapce('ip')}>{ip}</div>
          <div className={classNamesapce('hosts')}>{spanElement}</div>
        </div>
      );
    });
  }

  render () {
    const { index, text, name, list, onGroupRemove, onGroupEdit, location } = this.props;
    const classes = classnames({
      [classNamesapce('header')]: true,
      [classNamesapce('header', 'toggled')]: this.state.toggled
    });
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    return (
      <div className={classNamesapce('single')} key={index}>
        <div className={classes}>
          <div className={classNamesapce('title')} onClick={this.onTitleClick}>
            {text || name}
          </div>

          <div className={classNamesapce('action')}>
            <Link to={uri} className={classnames({
              [classNamesapce('action-edit')]: true,
              [classNamesapce('action-item')]: true
            })} onClick={() => onGroupEdit()}>
              <i className={classnames({
                ['iconfont']: true,
                ['icon-editor-fill']: true
              })}></i>
            </Link>

            <div className={classnames({
              [classNamesapce('action-remove')]: true,
              [classNamesapce('action-item')]: true
            })} onClick={() => onGroupRemove()}>
              <i className={classnames({
                ['iconfont']: true,
                ['icon-remove-fill']: true
              })}></i>
            </div>
            
          </div>
        </div>
        <div className={classNamesapce('content')}>
          <div className={classNamesapce('data')}>
            {this.listRender()}
          </div>
        </div>
      </div>
    );
  }
}