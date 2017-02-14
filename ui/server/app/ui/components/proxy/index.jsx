import React, { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';
import { flatten } from 'lodash';
import { Link, withRouter } from 'react-router';

import Toolbar from '../toolbar';

import './css/index.css';

class Proxy extends React.Component {
  static contextTypes = {
    Socket: PropTypes.func
  }

  constructor (props) {
    super();

    this.state = {
      proxy: []
    };
  }

  componentDidMount () {
    const { connection } = this.props;
    const { Socket } = this.context;
    let socket;

    this.socket = socket = new Socket('proxy', connection);
    
    socket.on('request', this.onSocketMessage.bind(this));
    socket.on('response', this.onSocketMessage.bind(this));
  }

  componentWillUnmount () {
    const { connection } = this.props;
    
    socket.off('request', this.onSocketMessage);
    socket.off('response', this.onSocketMessage);
  }

  onToolSelect (tool) {
    switch (tool) {
      case 'clear':
        this.setState({
          proxy: []
        });
        break;
    }
  }

  onSocketMessage (res) {
    const { proxy } = this.state;

    switch (res.type) {
      case 'request':
        proxy.push({
          id:      res.id,
          request: res.data
        });
        break;

      case 'response':
        proxy.some((prx, i) => {
          if (prx.id === res.id) {
            prx.response = res.data
            return true;
          }
        });
        break;

      case 'timeline':
        proxy.some((prx, i) => {
          if (prx.id === res.id) {
            prx.timeline = res.data
            return true;
          }
        });
        break;
    }

    this.setState({
      proxy
    });
  }

  onRowClick (position, e) {
    const { router, location } = this.props;
    const pathname = `/proxy/specifics/${position}`;

    if (location.pathname === pathname) {
      return router.push('/proxy');
    }

    router.push(pathname);
  }

  specificsRender (prx) {
    const { children } = this.props;
    let specificsElement;

    if (children) {
      specificsElement = React.cloneElement(children, prx || {});
    }

    return specificsElement;
  }

  headerRender () {
    const { header } = this.props;

    return (
      <table className="app__proxy-hd-table">
        <thead className="app__proxy-hd-thd">
          <tr className="app__proxy-hd-tr">
            {header.map((hd, i) => (
              <th key={i} className="app__proxy-hd-th" width={hd.width}>{hd.label}</th>
            ))}
          </tr>
        </thead>
      </table>
    );
  }

  columnRender (c, index) {
    const { header } = this.props;
    const { request, response, timeline } = c;
    
    return header.map((hd, i) => {
      let key = hd.key,
          value;

      switch (key) {
        case 'status':

          value = response ? response[key] : '-'; 
          break;
        case 'method':
        case 'address':
          value = request[key == 'address' ? 'ip' : key];
          break;
        case 'serial':
          value = index + 1;
          break;
        default:
          value = request[key];
          break;
      }

      return <td key={i} className="app__proxy-bd-td" width={hd.width} title={value}>{value}</td>;
    });
  }

  rowRender () {
    const { proxy } = this.state;
    const { header, params } = this.props;
    const { length } = header;
    let position;

    if (!(params.id === undefined)) {
       position = parseInt(params.id, 10);
    }

    return flatten(proxy.map((prx, i) => {
      let specifics;

      if (!(position === undefined)) {
        if (position === i) {
          specifics = this.specificsRender(prx);
        }
      }

      return [
        (
          <tr key={i} className={`app__proxy-bd-tr${specifics ? ' app__proxy-bd-tr_current' : ''}`} onClick={e => this.onRowClick(i, e)}>
            {this.columnRender(prx, i)}
          </tr>
        ),
        (
          <tr key={`specifics_${i}`}>
            <td colSpan={length} className={`app__proxy-specifics${specifics ? ' app__proxy-specifics_expand' : ''}`}>
              {specifics || null}
            </td>
          </tr>
        )
      ];
    }));
  }

  tableRender () {
    return (
      <table className="app__proxy-bd-table">
        <tbody className="app__proxy-bd-tbd">
          {this.rowRender()}
        </tbody>
      </table>
    );
  }

  render () {
    return (
      <div className="app__proxy">
        <Toolbar onSelect={this.onToolSelect.bind(this)}/>
        <div className="app__proxy-content">
          <div className="app__proxy-scroll">
            {this.headerRender()}
            {this.tableRender()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let proxy = state.proxy || {}

  return {
    header: proxy.cell.header,
    connection: state.socket.connection
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch1: () =>{
      dispatch(actionCreator)
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Proxy));