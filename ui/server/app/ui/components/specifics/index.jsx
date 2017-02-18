import React, { createElement } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';

import './css/index.css';

class Specifics extends React.Component {
  constructor (props) {
    super();

    this.tabTable = [
      { key: 'overview', text: 'Overview' },
      { key: 'request', text: 'Request' },
      { key: 'response', text: 'Response' },
      { key: 'preview', text: 'Preview' },
      { key: 'timeline', text: 'Timeline' },
    ];

    this.state = {
      current: 'overview'
    };
  }

  onTabClick (key) {
    const { current } = this.state;

    if (key === current) {
      return this;
    }

    this.setState({
      current: key
    });
  }

  overviewRender () {
    let { request, response, timeline } = this.props;

    request = request || {};
    response = response || {};
    timeline = timeline || {};

    return (
      <div className="app__specifics-overview">
        <div className="app__specifics-general app__specifics-content-group">
          <h3 className="app__specifics-content-group-title">General</h3>
          <div className="app__specifics-content-row">
            <span className="app__specifics-content-key">Request URL:</span>
            <span className="app__specifics-content-value">{request.url}</span>
          </div>
          <div className="app__specifics-content-row">
            <span className="app__specifics-content-key">Request Method:</span>
            <span className="app__specifics-content-value">{request.method}</span>
          </div>
          <div className="app__specifics-content-row">
            <span className="app__specifics-content-key">Status Code:</span>
            <span className="app__specifics-content-value">{response.status || '-'} {response.message}</span>
          </div>
          <div className="app__specifics-content-row">
            <span className="app__specifics-content-key">Remote Address:</span>
            <span className="app__specifics-content-value">{request.ip}</span>
          </div>
          {this.parametersRender()}
          {this.formDataRender()}
        </div>
      </div>
    );
  }

  parametersRender () {
    const { request } = this.props;
    const search = (request.search || '').slice(1);
    const params = qs.parse(search);
    const keys = Object.keys(params);
    let paramesElement;

    if (keys.length > 0) {
      paramesElement = (
        <div className="app__specifics-general app__specifics-content-group">
          <h3 className="app__specifics-content-group-title">Query String Parameters <span className="app__specifics-param-badge">{keys.length}</span></h3>
          {keys.map((name, index) => {
            return (
              <div key={index} className="app__specifics-content-row">
                <span className="app__specifics-content-key">{name}:</span>
                <span className="app__specifics-content-value">{params[name]}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return paramesElement;
  }

  formDataRender () {
    const { request } = this.props;
    const chunk = request.chunk;

    if (request.method === 'POST') {
      return (
        <div className="app__specifics-overview">
          <div className="app__specifics-general app__specifics-content-group">
            <h3 className="app__specifics-content-group-title">Request Payload</h3>
          </div>
        </div>
      );
    }
  }

  headerRender (headers) {
    const keys = Object.keys(headers);

    return keys.sort().map((name, index) => {
      const value = headers[name];

      name = name.replace(/(^[a-z])|\-[a-z]/g, function ($1, $2) {
        return $1.toUpperCase();
      });

      return (
        <div key={index} className="app__specifics-content-row">
          <span className="app__specifics-content-key">{name}:</span>
          <span className="app__specifics-content-value">{value}</span>
        </div>
      );
    });
  }

  previewRender () {
    let { response } = this.props;
    let headers;
    let contentElement;


    if (response) {
      headers = response.headers;
      
    }


    return (
      <div className="app__specifics-request">

      </div>
    );
  }

  requestRender () {
    let { request } = this.props;

    request = request || {};

    return (
      <div className="app__specifics-request">
        <div className="app__specifics-general app__specifics-content-group">
          <h3 className="app__specifics-content-group-title">Request Headers</h3>
          {this.headerRender(request.headers || {})}
          {this.parametersRender()}
        </div>
      </div>
    );
  }

  responseRender () {
    let { response } = this.props;

    response = response || {};

    return (
      <div className="app__specifics-response">
        <div className="app__specifics-general app__specifics-content-group">
          <h3 className="app__specifics-content-group-title">Response Headers</h3>
          {this.headerRender(response.headers || {})}
        </div>
      </div>
    );
  }

  tabRender () {
    const { current } = this.state;

    return this.tabTable.map((tab, index) => {
      return (
        <div 
          key={index}
          onClick={() => {this.onTabClick(tab.key)}}
          className={`app__specifics-tab ${current === tab.key ? 'app__specifics-tab_current' : ''}`}
        >{tab.text}</div>
      );  
    });
  }

  contentRender () {
    const { current } = this.state;
    let { request, response, timeline } = this.props;
    let overview;

    request = request || {};
    response = response || {};
    timeline = timeline || {};

    overview = {
      url:    request.url,
      method: request.method,
      ip:     request.ip
    };

    return this.tabTable.map((tab, index) => {
      const render = (this[`${tab.key}Render`] || function () {}).bind(this);

      return (
        <div className={`app__specifics-content-every${current === tab.key ? ' app__specifics-content_current' : ''}`}>
          {render()}
        </div>
      );
    });
  }

  render () {
    return (
      <div className="app__specifics">
        <div className="app__specifics-tabs">
          {this.tabRender()}
        </div>
        <div className="app__specifics-content">
          {this.contentRender()}
        </div>
      </div>
    );
  }
}

export default Specifics;
