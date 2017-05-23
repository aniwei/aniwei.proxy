import React from 'react';
import classnames from 'classnames';

export default class Overview extends React.Component {
  cellRender () {
    const { list } = this.props;

    return list.map((li) => {
      return (
        <div className="app__list-item-data-cell">
          <span className="app__list-item-data-cell-name">URL</span>
          <span className="app__list-item-data-cell-value">http://127.0.0.1:8080/build/6483742f85e21eb408093c4cd35981de.png</span>
        </div>
      );
    });
  }  

  render () {
    const { url } = this.props;

    return (
      <div className="app__list-item-overview">
        <div className="app__list-item-overview-content">
          <div className="app__list-item-data-title">
            {url}
          </div>

          {this.cellRender()}
        </div>

        <div className="app__list-item-overview-footer">
          <div className="app__list-item-overview-button">
            <a className="app__list-item-overview-button-lookup">
              查看更多
            </a>
          </div>
        </div>
      </div>
    );
  }
}