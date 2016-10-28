import React from 'react';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

export default function More (props) {
  const { onItemTouchTap, menuItem } = props;

  const menus = menuItem.map((menu, i) => <MenuItem
    primaryText={menu.text}
    value={menu.value}
    key={i}
  />)

  return <IconMenu
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    onItemTouchTap={(evt, it) => onItemTouchTap(it.props.value)}
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    {menus}
  </IconMenu>
}
