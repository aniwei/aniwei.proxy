import React, { createElement, PropTypes } from 'react';
import { Link } from 'react-router';

import { Grid, GridIcon, GridLabel } from 'react-weui';

import Container from './container';

export default class Preview extends React.Component {
  itemRender () {
    const { item } = this.props;
    let pluginElement,
        keys = Object.keys(item);

    if (keys) {
      pluginElement = keys.map((k, i) => {
        let plg  = item[k],
            desc = plg.brief;

        return (
          <Link key={i} className="weui-grid app__components-grid" to={`/components/${desc.className}?title=${desc.text}`}>
            <GridIcon className="app__components-grid-icon">
              <i className={`iconfont app__components-icon app__components-icon-${desc.icon} icon-${desc.icon}`}></i>
            </GridIcon>
            <GridLabel>
              <span className="app__components-text">{desc.text}</span>
            </GridLabel>
          </Link>
        );
      });

      return (
        <div className="app__components-listview">
          {pluginElement}
        </div>
      );
      
    }
  }

  render () {
    return (

      <div className="app__components-preview">
        <Container>
          {this.itemRender()}
        </Container>
      </div>
    );
  }
}