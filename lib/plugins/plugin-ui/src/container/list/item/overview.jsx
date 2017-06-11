import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link, Route } from 'react-router-dom';

import util from '../../../util';

const classNamespace = util.namespace('app__list-item-overview');
const dataNamespace = util.namespace('app__list-item-data');

export default class Overview extends React.Component {
  headerSubjectRender () {
    const { list } = this.props;
    const { location } = this.props;
    const query = queryString.parse(location.search);
    const overviewClosed = (query.overviewClosed || '').split(',');

    return list.map((li, i) => {
      const isClosedIndex = overviewClosed.indexOf(li.key);
      const isClosed = isClosedIndex > -1;

      const classes = classnames({
        [dataNamespace('subject')]: true,
        [dataNamespace('subject', 'closed')]: isClosed
      });

      const closed = overviewClosed.slice();

      if (isClosed) {
        closed.splice(isClosedIndex, 1);
      } else {
        closed.push(li.key);
      }

      if (closed.length === 0) {
        delete query.overviewClosed;
      } else {
        query.overviewClosed = closed.join(',');
      }

      const uri = `${location.pathname}?${queryString.stringify(query)}`;

      return (
        <div className={classes} key={i}>
          <div className={dataNamespace('title')}>
            <Link to={uri}>
              <i className={dataNamespace('subject-close-icon')}></i>
            </Link>
            {li.subject}
          </div>

          <div className={dataNamespace('content')}>
            {this.listRender(li.list, i)}
          </div>
        </div>
      );
    });
  }

  listRender (list, index) {
    return list.map((li, i) => {
      return (
        <div className={dataNamespace('cell')} key={i}>
          <span className={dataNamespace('cell-name')}>{li.text}</span>
          <span className={dataNamespace('cell-value')}>{li.value}</span>
        </div>
      );
    });
  }

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
        [classNamespace('tab', 'selected')]: isTabSelected
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
      <div className="app__list-item-overview-tabs">
        {tabElements}
      </div>
    );
  }

  render () {
    const { location, tabs } = this.props;
    const { pathname, search } = location;
    const qs = queryString.parse(search);

    delete qs.overlay;
    delete qs.overviewSelectedTab;

    const closeUrl = `${pathname}?${queryString.stringify(qs)}`;

    qs.overlay = 'visiable';

    const moreUrl = `${pathname}?${queryString.stringify(qs)}`;

    return (
      <div className="app__list-item-overview">

        <div className="app__list-item-overview-content">
          {this.headerSubjectRender()}
        </div>

        <div className="app__list-item-overview-footer">
          <div className="app__list-item-overview-button">
            <Link to={moreUrl} className="app__list-item-overview-button-lookup">
              查看更多
            </Link>
          </div>
        </div>
      </div>
    );
  }
}