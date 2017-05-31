import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

export default class Overview extends React.Component {
  subjectRender () {
    const { list } = this.props;

    return list.map((li, i) => {
      return (
        <div className="app__list-item-data-subject" key={i}>
          <div className="app__list-item-data-title">
            {li.subject}
          </div>

          {this.listRender(li.list, i)}
        </div>
      );
    });
  }

  listRender (list, index) {
    return list.map((li, i) => {
      return (
        <div className="app__list-item-data-cell" key={i}>
          <span className="app__list-item-data-cell-name">{li.text}</span>
          <span className="app__list-item-data-cell-value">{li.value}</span>
        </div>
      );
    });
  }

  render () {
    const { location } = this.props;
    const { pathname, search } = location;
    const qs = queryString.parse(search);

    delete qs.overlay;

    const closeUrl = `${pathname}?${queryString.stringify(qs)}`;

    qs.overlay = 'visiable';

    const moreUrl = `${pathname}?${queryString.stringify(qs)}`;

    return (
      <div className="app__list-item-overview">
        <Link to={closeUrl}>
          <i className="app__list-item-overview-close-icon iconfont icon-close"></i>
        </Link>
        <div className="app__list-item-overview-content">
          {this.subjectRender()}
        </div>

        <div className="app__list-item-overview-footer">
          <div className="app__list-item-overview-button">
            <Link to={moreUrl} className="app__list-item-overview-button-lookup">
              查看更多
            </Link>
          </div>
        </div>
      </div>
    );
  }
}