import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import './less/index.less';

import Tool from './tool';

class Toolbar extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    tools: PropTypes.array
  };

  static defaultProps = {
    onSelect: () => {}
  };

  toolsRender () {
    const { tools, onSelect } = this.props;
    const toolsElement = tools.map((group, index) => {
      const listElement = group.list.map(
        li => 
          <Link to={`${group.key}/${li.key}`} className="app__toolbar-tool" key={`group:${group.key},tool:${li.key}`}>
            <Tool 
              key={`group:${group.key},tool:${li.key}`}
              selected={li.active} 
              type={li.key} 
              fixed={li.fixed} 
              onSelect={(e) => onSelect(li.key, li, group.key, group, e)} 
            />
          </Link>
      );

      return (
        <li className="app__toolbar-item" key={`group:${group.key}`} title={group.text}>
          {listElement}
        </li>
      );
    });

    return (
      <ul className="app__toolbar-listview clearfix">
        {toolsElement}
      </ul>
    );
  }

  render () {
    return (
      <div className="app__toolbar">
        {this.toolsRender()}
      </div>
    );
  }
}

export default Toolbar;