import actionType from '../constants';

export function navigatorItemTap (current) {
  let type = actionType.NAVIGATOR_ITEM_TAP;

  return {
    type,
    current
  }
}

export function sceneActive (active) {
  let type = actionType.SCENE_ACTIVE;

  return {
    type,
    active
  }
}

export function pluginActive (current) {
  let type = actionType.PLUGIN_ACTIVE;

  return {
    type,
    current
  }  
}