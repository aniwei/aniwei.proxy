import React from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import { Link , withRouter } from 'react-router';

import util from '../../util';

const classNamespace = util.namespace('app__overview-header');

class Header extends React.Component {
  subjectRender () {
    const { list, location } = this.props;
    const query = queryString.parse(location.search);
    const overviewClosed = (query.overviewClosed || '').split(',');

    return list.map((li, i) => {
      const isClosedIndex = overviewClosed.indexOf(li.key);
      const isClosed = isClosedIndex > -1;

      const classes = classnames({
        ['app__list-item-data-subject']: true,
        ['app__list-item-data-subject_closed']: isClosed
      });

      const closed = overviewClosed.slice();

      if (isClosed) {
        closed.splice(isClosedIndex, 1);
      } else {
        closed.push(li.key);
      }

      if (closed.length === 0) {
        delete query.overviewClosed;
      } else {
        query.overviewClosed = closed.join(',');
      }

      const uri = `${location.pathname}?${queryString.stringify(query)}`;

      return (
        <div className={classes} key={i}>
          <div className="app__list-item-data-title">
            <Link to={uri}>
              <i className="app__list-item-data-subject-close-icon"></i>
            </Link>
            {li.subject}
          </div>

          <div className="app__list-item-data-content">
            {this.listRender(li.list, i)}
          </div>
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
    return (
      <div className={classNamespace()}>
        {this.subjectRender()}
      </div>
    );
  }
}

export default (Header);