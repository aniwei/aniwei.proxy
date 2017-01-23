import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router';
import { assign } from 'lodash'; 

import 'whatwg-fetch';
import { Grid, GridIcon, GridLabel } from 'react-weui';
import './css/index.css';

import * as actions from '../../actions';


class Plugin extends React.Component {
  componentDidMount () {
    const { plugin, toUpdate, toActive } = this.props;

   
    if (!plugin) {
      fetch('/plugin', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        return res.json()
      })
      .then((res) => {
        toUpdate(res.data);
      })
      .catch(() => {

      });
    }
  }

  onItemClick (i, plg) {
    const { toSelect } = this.props;

    toSelect(plg);
  }

  onBackClick () {
    toSelect(null);
  }

  pluginRender () {
    const { plugin } = this.props;
    let pluginElement;

    if (plugin) {
      pluginElement = plugin.map((plg, i) => {
        return (
          <Grid key={i} className="app__plugin-grid" onClick={() => this.onItemClick(i, plg)}>
            <GridIcon>
              <i className={`iconfont app__plugin-icon app__plugin-icon-${plg.icon} icon-${plg.icon}`}></i>
            </GridIcon>
            <GridLabel>
              <span className="app__plugin-text">{plg.text}</span>
            </GridLabel>
          </Grid>
        );
      });

      return (
        <div className="app__plugin-listview">
          {pluginElement}
        </div>
      );
      
    }
  }

  previewRender () {
    return (
      <div className="app__plugin-preview">
        <div className="app__plugin-title">
          组件服务
          <p className="app__plugin-title-desc">Component Service</p>
        </div>
        {this.pluginRender()}
      </div>
    );
  }

  editorRender () {
    const { children } = this.props;

    return (
      <div className="app__plugin-editor">
        {children}
      </div>
    );
  }

  render () {
    const { className } = this.props;

    return (
      <div className={className}>
        {this.previewRender()}
        {this.editorRender()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let plugin = state.plugin,
      cls    = 'app__plugin',
      name,
      childs;

  if (state.pluginItem) {
    name = state.pluginItem.name;
    
    if (name) {
      cls += ` app__plugin-selected app__selected-${name}`;
    }
  }

  if (name) {
    childs = React.Children.map(ownProps.children, (chi, i) => {
      const props = chi.props;
      let cloned = props.name == name ? state.pluginItem : {};

      return React.cloneElement(chi, assign({
        style: {
          display: props.name == name ? 'block' : 'none'
        }
      }, cloned));
    });
  }

  return {
    children: childs || ownProps.children, 
    className: cls,
    plugin: plugin.item
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    toUpdate: actions.pluginUpdate,
    toActive: actions.sidebarActive,
    toSelect: actions.pluginSelected
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugin);