import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';

import './less/index.less';

import util from '../../util';

const classNamespace = util.namespace('app__extension-view');

class ExtensionView extends React.Component {
  render () {
    const { location } = this.props;
    const qs = queryString.parse(location.search);
    const classes = classnames({
      [classNamespace()]: true,
      [classNamespace(null, 'overlay')]: 'id' in qs
    });

    return (
      <div className={classes}>

      </div>
    );
  }
}

export default ExtensionView;