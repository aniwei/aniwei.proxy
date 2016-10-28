import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBar from 'material-ui/AppBar';
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

import './css/index.css'
import * as actions from '../../actions';
import Drawer from './drawer';

class Home extends React.Component {
  constructor (props, context) {
    super();

    this.state = {
      proxyRequest:   [],
      proxyResponse:  [],
      hashTable: {}
    }

    this.onRowSelection = this.onRowSelection.bind(this)
  }

  componentDidMount () {
    const { socket } = this.props;

    socket.io.on('proxy', this.onProxy.bind(this));
  }

  componentWillUnmount () {
    const { socket } = this.props;

    socket.io.off('proxy');
  }

  onProxy (req) {
    let { proxyRequest, proxyResponse } = this.state;

    req.type == 'request' ?
      proxyRequest.push(req.data) :
      proxyResponse.push(req.data);

    this.setState({
      proxyRequest:   proxyRequest,
      proxyResponse:  proxyResponse
    });
  }

  onRowSelection (id) {
    const { onItemTouchTap } = this.props;
    const { hashTable } = this.state;
    let packet;

    id = id.pop();
    packet = hashTable[id];

    if (!packet) {
      packet = {
        request: this.search('request', id),
        response: this.search('response', id)
      }
    }

    if (!packet.request) {
      packet.request = this.search('request', id)
    }

    if (!packet.response) {
      packet.response = this.search('response', id)
    }

    hashTable[id] = packet;

    onItemTouchTap(packet);
  }

  search (type, id) {
    let { proxyRequest, proxyResponse } = this.state,
        proxy = type == 'request' ? proxyRequest : proxyResponse,
        hold  = proxy[id],
        rid;

    if (type == 'request') {
      return hold;
    }

    rid = (proxyRequest[id] || {}).id;

    if (!(rid === undefined)) {
      proxy.some((proxy) => {
        if (rid === proxy.id) {
          return hold = proxy;
        }
      });
    }

    return hold;
  }

  drawersRender () {
    const { drawer, onItemTouchTap } = this.props

    return <Drawer
      open={!!drawer}
      onItemTouchTap={onItemTouchTap}
      packet={drawer}
    />
  }

  tableRender () {
    const { onItemTouchTap } = this.props;
    const { proxyRequest, proxyResponse, hashTable } = this.state;

    let content = proxyRequest.map((req, i) =>
      <TableRow key={req.id} rowNumber={req.id}>
        <TableRowColumn>{i + 1}</TableRowColumn>
        <TableRowColumn>{req.href}</TableRowColumn>
      </TableRow>
    )

    return <Table
      onRowSelection={this.onRowSelection}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>URL</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
      >
        {content}
      </TableBody>
    </Table>
  }

  render () {
    const { onItemTouchTap } = this.props

    return <div className="view__home">
      <AppBar
        title="代理数据"
      />
      {this.drawersRender()}
      {this.tableRender()}
    </div>
  }
}

function mapStateToProps (state) {
  let home = state.home;

  return {
    drawer: home.drawer,
    socket: state.socket
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onItemTouchTap: actions.homeItemTouchTap
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
