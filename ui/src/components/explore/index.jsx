import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';

import * as actions from '../../actions';
import './css/index.css'

class Explore extends React.Component {
  constructor (props, context) {
    super();
  }

  midwayRender () {
    const { components } = this.props
    let cmps = components.map((cmp, i) => {
      let item = cmp.data.map((it, j) => {
        return  <ListItem
          key={j}
          primaryText={it.text}
        />
      });

      return <List key={i}>
        <Subheader>{cmp.title}</Subheader>
          {item}
      </List>
    });

    return <div className="view__midway">
      {cmps}
    </div>
  }

  render () {
    const { label } = this.props

    return <div className="view__explore">
      <AppBar
        title={label}
      />
      {this.midwayRender()}
    </div>
  }
}

function mapStateToProps (state) {
  let explore = state.explore;

  return {
    components: explore.components,
    drawer: explore.drawer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onMidwayTouchTap: actions.exploreMidwayTouchTap
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
