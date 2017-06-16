import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import Scroll from 'react-iscroll';
import iScroll from 'iscroll';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect, Route } from 'react-router-dom';

import util from '../../util';
import Header from './header';
import Preview from './preview';

import './less/index.less';

const classNamespace = util.namespace('app__overview');

class Overview extends React.Component {
  previewRender (data) {
    const { type, url } = data;
    const props = {
      url,
      type
    };

    return (
      <Preview {...props} />
    );
  }

  headerRender (data) {
    const { location, list } = this.props;
    const query = queryString.parse(location.search);

    let classes;
    let elementView;

    if (query) {
      classes = classnames({
        [classNamespace('content')]: true
      });
    }

    const { code, url, path, method, ip, route, message, requestHeaders, responseHeaders } = data;

    const props = [
      {
        subject: 'General',
        key: 'general',
        list: [
          { key: 'url', text: 'URL', value: url },
          { key: 'method', text: 'Method', value: method },
          { key: 'code', text: 'Status', value: `${code || ''} ${message || ' - '}` },
          { key: 'code', text: 'Address', value: ip }
        ]
      },
      {
        subject: 'Request Headers',
        key: 'request',
        list: Object.keys(requestHeaders).map((hd, i) => {
          return {
            key: hd,
            text: hd,
            value: requestHeaders[hd]
          };
        })
      }
    ];

    if (responseHeaders) {
      props.push({
        subject: 'Response Headers',
        key: 'response',
        list: Object.keys(responseHeaders).map((hd, i) => {
          return {
            key: hd,
            text: hd,
            value: responseHeaders[hd]
          };
        })
      });
    }

    return (
      <Header list={props} location={location} />
    );
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

  routeRender () {
    const { location, list, tabs } = this.props;
    const query = queryString.parse(location.search);
    const { group, id } = query;
    
    let refs;

    if (query.group && query.id && query.overlay === 'visiable') {
      if (refs = list[group]) {
        refs = refs.list;

        if (refs) {
          refs = refs[id];
        }
      }

      if (refs) {
        return (
          <Route path="/" render={(location) => {
            const overviewSelectedTab = query.overviewSelectedTab || tabs[0].key;
            const render = () => this[`${overviewSelectedTab}Render`](refs);

            return render();
          }} />
        );
      }
    }

    if (query.overlay) {
      delete query.overlay;
      const search = queryString.stringify(query);

      return (
        <Redirect to={{
          pathname: location.pathname,
          search: `?${search}`
        }}/>
      );
    }
  }

  render () {
    const { location, tabs } = this.props;
    const query = queryString.parse(location.search);

    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'overlayed')]: query.overlay === 'visiable'
    });

    delete query.overlay;

    const uri = `${location.pathname}?${queryString.stringify(query)}`;

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

        <div className={classNamespace('content')}>
          {/*<Scroll ref="iscroll" iScroll={iScroll} options={{ mouseWheel: true, click: true }}>*/}
            <div className={classNamespace('content-inner')}>
              {this.routeRender()}
            </div>
          {/*</Scroll>*/}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  const { list, socket } = state;
  const { subjects, keys, search, overviewTabs, overviewData } = list;

  return {
    list: subjects,
    tabs: overviewTabs,
    keys,
    socket,
    search
  };
}

export default connect(mapStateToProps)(withRouter(Overview));