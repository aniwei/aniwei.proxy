import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const style = {
  background: 'rgba(255, 255,255, 0)',
  boxShadow: 'none'
}

const width = window.screen.width;

const Common = (props) => {
  const { open, onItemTouchTap, title, children } = props

  return <Drawer
    width={width}
    openSecondary={true}
    open={open}
  >
    <div className="view__about-drawer">
      <AppBar
        style={style}
        title={title}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        onLeftIconButtonTouchTap={() => onItemTouchTap(null)}
      />
      {children}
    </div>
  </Drawer>
}

const Download = (props) => {
  return <Common {...props}>
    <div className="view__about-download">
      <RaisedButton
      label="下载证书"
      labelPosition="before"
      href="//aniwei.proxy/download/cert"
      icon={<FontIcon className="material-icons">featured_play_list</FontIcon>}
    />
    </div>
  </Common>
}

const Help = (props) => {
  return <Common {...props}>
  </Common>
}

export default {
  Download,
  Help
}
