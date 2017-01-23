import type from '../constants';

export function navigationTouchTap (current) {
  return {
    type: type.NAVIGATION_ITEM,
    navigationItem: current
  }

}

export function sidebarActive (active) {
  return {
    type: type.SIDEBAR_ACTIVE,
    active
  }
}

export function pluginUpdate (plugin) {
  return {
    type:   type.PLUGIN_UPDATE,
    plugin
  }
}

export function pluginSelected (plugin) {
  return {
    type:   type.PLUGIN_TYPE,
    plugin
  }
}

export function homeItemTouchTap (drawer) {
  return {
    type:   type.HOME_ITEM,
    drawer:  drawer
  }
}

export function homeSocket (socket) {
  return {
    type:   type.HOME_SOCKET,
    socket:  socket
  }
}

export function exploreMidwayTouchTap (drawer) {
  return {
    type:   type.EXPLORE_MIDDWAY_ITEM,
    drawer:  drawer
  }
}


export function progressDisplay (display) {
  return {
    type: type.PROGRESS_DISPLAY,
    display: display
  }
}
