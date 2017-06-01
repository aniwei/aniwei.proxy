import React from 'react';

import './less/index.less';

import SearchBar from './search';
import Item from './item';

class List extends React.Component {

  itemRender (list) {
    return list.map((li, index) => {
      const props = {
        code: li.code,
        url: li.url,
        ip: li.ip,
        method: li.method,
        path: li.path,
        route: `/list/${index}`
      };

      return (
        <Item {...props} key={index} />
      );
    });
  }

  groupRender () {
    const { list } = this.props;

    const groupElement = list.map((li, index) => {
      const itemElement = this.itemRender(li.list);

      return (
        <div className="app__list-item-group" key={index}>
          <div className="app__list-item-group-title">
            <div className="app__list-item-group-subject">
              {li.subject}
            </div>
          </div>  
          <div className="app__list-item-group-content">
            {itemElement}
          </div>
        </div>
      );
    });

    return groupElement;
  }

  render () {
    return (
      <div className="app__list">
        <div className="app__list-toolbar">
          <SearchBar />
        </div>

        <div className="app__list-view">
          {this.groupRender()}
        </div>
      </div>
    );
  }
}

export default List;