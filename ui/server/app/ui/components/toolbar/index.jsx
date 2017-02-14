import React, { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';

import './css/index.css';

class Toolbar extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func
  }

  static defaultProps = {
    onSelect: () => {}
  }

  constructor () {
    super();

    this.toolsTable = [
      { key: 'clear', text: 'Clear', title: 'Clear Proxy List', icon: 'remove' },
      { key: 'debug', text: 'Debug', title: 'Clear Proxy List', icon: 'remove' },
      { key: 'filter', text: 'Filter', title: 'Clear Proxy List', icon: 'remove' }
    ];
  }

  onSelect (tool) {
    const { onSelect } = this.props;

    onSelect(tool.key);
  }

  toolsRender () {
    return this.toolsTable.map((tool, index) => {
      return (
        <li 
          className="app__toolbar-item" key={index} 
          onClick={e => this.onSelect(tool, e)}
          title={tool.title}
        >
            <i className={`iconfont icon-${tool.icon}`} />
        </li>
      );
    });
  }

  render () {
    const { onSelect } = this.props;

    return (
      <div className="app__toolbar">
        <ul className="app__toolbar-listview">
          {this.toolsRender()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    header: state
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch1: () =>{
      dispatch(actionCreator)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);