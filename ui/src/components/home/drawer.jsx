import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';

import CircularProgress from 'material-ui/CircularProgress';

import mimeType from '../../common/mime';
import mime from './mime';

const style = {
  boxShadow: 'none',
  background: 'transparent'
}

const width = window.screen.width;

const Progress = (props) => {
  const { display } = props
  let style = { display: display ? '' : '' }

  return <div className="view__home-progress" style={style}>
    <CircularProgress className="view__home-progress-circular"/>
  </div>
}

class Item extends React.Component {
  constructor (props) {
    super();

    this.state = {
      value: 'request.headers',
      tabs: [
        {label: '概览', value: 'general', alias: 'general', content: props.general},
        {label: '请求头', value: 'request.headers', alias: 'request', content: props.request},
        {label: '响应头', value: 'response.headers', alias: 'response', content: props.response},
        {label: '响应内容', value: 'request.context', alias: 'content', content: null}
      ]
    }

    this.onChange = this.onChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    let tabs = this.state.tabs;

    ['general', 'request', 'response', 'content'].forEach((key) => {
      if (key in nextProps) {
        tabs.some((t) => {
          if (key == t.alias) {
            return t.content = nextProps[key]
          }
        });
      }
    });
    
    this.setState({
      tabs: tabs
    });
  } 

  onChange (value) {
    this.setState({
      value: value
    });
  }

  tabsRender () {
    const { onItemTouchTap } = this.props;
    const data = this.state.tabs;

    let tab = data.map((t, i) => {
      return <Tab key={i} label={t.label} value={t.value}></Tab>
    });

    return <Tabs
      style={style}
      onChange={this.onChange}
      value={this.state.value}
      initialSelectedIndex={0}
    >
      {tab}
    </Tabs>
  }

  contentRender () {
    const { response, url } = this.props;
    const { tabs } = this.state;
    let contentType,
        type,
        element,
        tab;

    tab = tabs.filter((t) => t.alias == 'content').pop();

    if (response) {
      contentType = response['content-type'] || response['Content-Type'] || response['Content-type'] || response['content-Type'];
      type        = mimeType.extension(contentType);
      element     = mime[type]; 

      if (element) {
        return React.createElement(mime[type], {
          url: url
        });
      }
    }
  }

  contentHeaderRender () {
    const { value, tabs } = this.state;
    let current,
        content,
        element,
        collection;

    tabs.some((tab) => {
      if (tab.value == value) {
        return current = tab
      }
    });

    content = current.content;

    if (current.alias == 'content') {
      return !content ? this.contentRender() : content;
    }
    
    element = Object.keys(content || {}).map((header, i) => {
      return <div className="view__header" key={i}>
        <div className="view__header-name">{header.toUpperCase()}</div>
        <div className="view__header-value">{content[header]}</div>
      </div>
    })

    return <div className="view__headers">
      {element}
    </div>
  }

  // generalRender () {
  //   const { general } = this.props;

  //   if (general) {
  //     return undefined;
  //   }

  //   return <div className="view__home-drawer-general">
  //     {general.method}
  //   </div>
  // }

  render () {
    const { open, onItemTouchTap, url } = this.props;
    const title = url || null;

    return <Drawer
      width={width}
      openSecondary={true}
      open={open}
    >
      <div className="view__home-drawer">
        <div className="view__home-drawer-header">
          <AppBar
            style={style}
            title={title}
            iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            onLeftIconButtonTouchTap={() => onItemTouchTap(null)}
          />
          {this.tabsRender()}
        </div>
      </div>
      <div className="view__home-drawer-content">
        {this.contentHeaderRender()}
      </div>
    </Drawer>
  }
}

export default Item
