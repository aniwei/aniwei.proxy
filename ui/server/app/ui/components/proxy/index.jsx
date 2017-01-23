import React, { createElement } from 'react';
import { connect } from 'react-redux';

import Toolbar from '../toolbar';

import './css/index.css';

class Proxy extends React.Component {
  constructor (props) {
    super();

    this.state = {
      proxy: []
    };
  }

  componentDidMount () {
    const { connection } = this.props;

    connection.on('proxy', this.connectionHandle.bind(this));
  }

  componentWillUnmount () {
    const { connection } = this.props;
    
    connection.off('proxy', this.connectionHandle);
  }

  connectionHandle (data) {
    let proxy = this.state.proxy;

    if (!proxy.some((prx, i) => (
        prx.id === data.id && (proxy[i]= data)
    ))) {
      proxy.push(data);
    }

    this.setState({
      proxy: proxy
    });
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
    
    return header.map((hd, i) => {
      let key = hd.key,
          value;

      switch (key) {
        case 'status':
          value = c.general[key] || '-'
          break;
        case 'method':
        case 'address':
          value = c.general[key];
          break;
        case 'number':
          value = index + 1;
          break;
        default:
          value = c[key];
          break;
      }

      return <td key={i} className="app__proxy-bd-td" width={hd.width} title={value}>{value}</td>
    });
  }

  rowRender () {
    const { proxy } = this.state;

    return proxy.map((prx, i) => {
      return (
        <tr key={i} className="app__proxy-bd-tr">
          {this.columnRender(prx, i)}
        </tr>
      );
    });
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
        <Toolbar />
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

export default connect(mapStateToProps, mapDispatchToProps)(Proxy);