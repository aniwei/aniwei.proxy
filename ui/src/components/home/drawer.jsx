import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';

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
  constructor () {
    super();

    this.state = {
      value: 'request.headers'
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange (value) {
    this.setState({
      value: value
    });
  }

  tabsRender () {
    let packet = this.props.packet || {};
    const data = [
      {label: '请求头', value: 'request.headers'},
      {label: '响应头', value: 'response.headers'},
      {label: '响应内容', value: 'request.context'}
    ];
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

  render () {
    const { open, onItemTouchTap, packet } = this.props;
    let title = packet ? packet.request.href : null

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
    </Drawer>
  }
}

export default Item
