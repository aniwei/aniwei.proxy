import type from '../constants';

export function navigationTouchTap (current) {
  return {
    type: type.NAVIGATION_ITEM,
    navigationItem: current
  }
}

export function aboutMoreTouchTap (drawer) {
  return {
    type:   type.ABOUT_MORE_MENU_ITEM,
    drawer:  drawer
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
