import React from 'react';
import classnames from 'classnames';

class Tools extends React.Component {
  onToolClick = (li, e) => {
    const { dispatch, tools } = this.props;

    if (!li.href) {
      e.preventDefault();
    }

    dispatch({
      type: li.action,
      tool: li
    });
  }

  listRender (list) {
    const toolElements = list.map((li, i) => {
      const classes = classnames({
        ['app__list-toolbar-tools-item']: true,
        ['app__list-toolbar-tools-item_selected']: li.selected
      });

      let element;

      return (
        <div className={classes} key={i} onClick={e => this.onToolClick(li, e)}>
          <a href={li.href}>
            <i className={li.icon}></i>
          </a>
        </div>
      );
    });

    return toolElements;
  }

  groupRender () {
    const { tools } = this.props;
    const { list } = tools;

    return list.map((li, index) => {

      return (
        <div className="app__list-toolbar-tools-group" key={index}>
          {this.listRender(li.list, index)}
        </div>
      );
    });
  }

  render () {
    return (
      <div className="app__list-toolbar-tools">
        {this.groupRender()}
      </div>
    );
  }
}

export default Tools;