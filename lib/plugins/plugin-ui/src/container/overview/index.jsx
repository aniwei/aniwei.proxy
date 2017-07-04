import React, { cloneElement } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import urlParser from 'url-parse';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect, Route } from 'react-router-dom';

import util from '../../util';
import Header from './header';
import Preview from './preview';

import './less/index.less';

const classNamespace = util.namespace('app__overview');

class Overview extends React.Component {
  previewRender (data) {
    const { dispatch } = this.props;
    const { id, code, type, url, previewContent } = data;
    const props = {
      id,
      url,
      type,
      code,
      dispatch,
      preview: previewContent
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

    const { id, code, url, path, method, ip, route, message, requestHeaders, responseHeaders } = data;
    const urlParsed = urlParser(url);
    const props = [];

    props.push(
      {
        subject: 'General',
        key: 'general',
        list: [
          { key: 'url', text: 'url', value: url },
          { key: 'method', text: 'method', value: method },
          { key: 'code', text: 'status', value: `${code || ''} ${message || ' - '}` },
          { key: 'code', text: 'address', value: ip || '-' }
        ]
      }
    );

    if (urlParsed.query) {
      const qs = queryString.parse(urlParsed.query);

      props.push({
        subject: 'Query String Parameters',
        key: 'query',
        list: Object.keys(qs).map((key) => {
          return {
            key,
            text: key,
            value: qs[key]
          }
        })
      });
    }

    props.push(
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
    );

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
      <Header list={props} location={location} id={id} />
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
        <Link to={uri} key={tab.key} className={classNamespace('tab-link')} style={style}>
          <div className={classes}>
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
          <Route render={(location) => {
            const overviewSelectedTab = query.overviewSelectedTab || tabs[0].key;
            const elements = ['header', 'preview'].map((key, i) => {
              const element = this[`${key}Render`](refs);
              return cloneElement(element, {
                hidden: !(key === overviewSelectedTab),
                key,
              });
            });  
          

            return (
              <div className={classNamespace('content')}>
                {elements}
              </div>
            );
          }} />
        );
      }
    }

    if (query.overlay) {
      delete query.overlay;
      const search = queryString.stringify(query);

      return (
        <Redirect to={`${location.pathname}?${search}`} />
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
        <div className={classNamespace('inner')}>
          <Link to={uri}>
            <i className={classnames({
              [classNamespace('close-icon')]: true,
              ['iconfont']: true, 
              ['icon-close']: true
            })}></i>
          </Link>

          {this.tabsRender()}
          {this.routeRender()}
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