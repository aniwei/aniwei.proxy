import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import util from '../../util';
import Header from './header';

import './less/index.less';

const classNamespace = util.namespace('app__overview');

class Overview extends React.Component {
  
  tabsRender () {
    const { location, tabs } = this.props;
    const query = queryString.parse(location.search);
    const overviewSelectedTab = query.overviewSelectedTab || tabs[0].key;
    const style = {
      width: `${100 / tabs.length}%`
    };

    const tabElements = tabs.map((tab, i) => {
      const isTabSelected = overviewSelectedTab === tab.key;
      const classes = classnames({
        [classNamespace('tab')]: true,
        [classNamespace('tab','selected')]: isTabSelected
      });

      query.overviewSelectedTab = tab.key;
      
      const uri = `${location.pathname}?${queryString.stringify(query)}`;

      return (
        <Link to={uri} key={tab.key}>
          <div className={classes} style={style}>
            {tab.text}
          </div>
        </Link>       
      );
    });

    return (
      <div className={classNamespace('tabs')}>
        {tabElements}
      </div>
    );
  }

  render () {
    const { location, list } = this.props;
    const query = queryString.parse(location.search);
    const uri = '';
    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'overlayed')]: query.overlay === 'visiable'
    });

    return (
      <div className={classes}>
         <Link to={uri}>
          <i className={classnames({
            [classNamespace('close-icon')]: true,
            ['iconfont']: true, 
            ['icon-close']: true
          })}></i>
        </Link>

        {this.tabsRender()}

        {/*<Header location={location} list={list}/>*/}

      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  const { list, socket } = state;
  const { subjects, keys, search, overviewTabs } = list;

  return {
    list: subjects,
    tabs: overviewTabs,
    keys,
    socket,
    search
  };
}

export default connect(mapStateToProps)(withRouter(Overview));