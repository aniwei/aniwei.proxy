import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import './css/index.css'
import * as actions from '../../actions';
import Drawer from './drawer';
import AppBar from '../appbar';

class Home extends React.Component {
  constructor (props, context) {
    super();

    this.state = {
      general:   [],
      hashTable: {},
      current: null
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

  onProxy (gen) {
    const { onItemTouchTap } = this.props;
    let { general, current } = this.state,
        cur;

    if (!general.some((g, i) => {
      if (g.id === gen.id) {
        cur        = i;
        general[i] = gen;

        return true;
      }
    })) {
      general.push(gen)
    } else {
      if (current === cur) {
        onItemTouchTap(gen);
      }
    }


    this.setState({
      general: general
    });
  }

  onRowSelection (id) {
    const { onItemTouchTap } = this.props;
    let { hashTable, general } = this.state,
        packet;

    id = id.pop();
    packet = hashTable[id];

    if (!packet) {
      packet = general[id]
      hashTable[packet.id] = packet;
    }

    this.current = id;

    onItemTouchTap(packet);
  }

  search (id) {
    let { general } = this.state,
        hold;
       
    general.some((proxy) => {
      if (id === proxy.id) {
        return hold = proxy;
      }
    });

    return hold;
  }

  drawersRender () {
    const { drawer, onItemTouchTap } = this.props;

    return <Drawer
      open={!!drawer}
      onItemTouchTap={onItemTouchTap}
      {...drawer}
    />
  }

  tableRender () {
    const { onItemTouchTap } = this.props;
    const { general, hashTable } = this.state;
    const serialStyle = {
      width: '50px',
      padding: '0',
      textAlign: 'center'
    }
    const hrefStyle = {
      paddingLeft: '0'
    }

    let content = general.map((gen, i) =>
      <TableRow key={gen.id} rowNumber={gen.id}>
        <TableRowColumn style={serialStyle}>{i + 1}</TableRowColumn>
        <TableRowColumn style={hrefStyle}>{gen.url}</TableRowColumn>
      </TableRow>
    )

    return <Table
      onRowSelection={this.onRowSelection}
    >
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
