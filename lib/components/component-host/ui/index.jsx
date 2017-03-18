import React, { createElement, PropTypes } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Router, Route, Link, hashHistory, IndexRoute, withRouter } from 'react-router';

import { Preview, PreviewHeader, PreviewFooter, PreviewBody, PreviewItem, PreviewButton } from 'react-weui';

import './css/index.css';

class Host extends React.Component {
  render () {
    return (
      <div className="app__host">
        <Preview>
          <PreviewHeader>
            <PreviewItem label="Total" value="$49.99" />
          </PreviewHeader>
          <PreviewBody>
            <PreviewItem label="Product" value="Name" />
            <PreviewItem label="Description" value="Product Description" />
            <PreviewItem label="Details" value="Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. " />
          </PreviewBody>
          <PreviewFooter>
            <PreviewButton primary>Action</PreviewButton>
          </PreviewFooter>
        </Preview>
      </div>
    );
  }
}

export default Host;
