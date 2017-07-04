import React from 'react';
import classname from 'classnames';

class Tools extends React.Component {
  listRender () {
    const { list } = this.props;

    return list.map(() => {

    });
  }

  render () {
    return (
      <div className="app__list-toolbar-tools">
        {/*{this.listRender()}*/}
      </div>
    );
  }
}

export default Tools;