import React, { createElement, PropTypes } from 'react';
import { Link } from 'react-router';

import { Grid, GridIcon, GridLabel } from 'react-weui';


export default class Preview extends React.Component {
  itemRender () {
    const { item } = this.props;
    let pluginElement;

    if (item) {
      pluginElement = item.map((plg, i) => {
        let desc = plg.description;

        return (
          <Link key={i} className="weui-grid app__plugin-grid" to={`/midway/${plg.key}?title=${desc.text}`}>
            <GridIcon>
              <i className={`iconfont app__plugin-icon app__plugin-icon-${desc.icon} icon-${desc.icon}`}></i>
            </GridIcon>
            <GridLabel>
              <span className="app__plugin-text">{desc.text}</span>
            </GridLabel>
          </Link>
        );
      });

      return (
        <div className="app__plugin-listview">
          {pluginElement}
        </div>
      );
      
    }
  }

  render () {
    return (
      <div className="app__plugin-preview">
        <div className="app__plugin-title">
          组件服务
          <p className="app__plugin-title-desc">Component Service</p>
        </div>
        {this.itemRender()}
      </div>
    );
  }
}