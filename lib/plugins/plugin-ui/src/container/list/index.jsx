import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';

// import './less/index.less';

import SearchBar from './search';
import Tools from './tools';
import Item from './item';
import constants from '../../constants';
import util from '../../util';

const classNameSpace = util.namespace('app__list');

class List extends React.Component {
  componentDidMount () {
    const { socket, dispatch, list, keys } = this.props;

    socket.on('ui/request', (proxy) => {
      const type = proxy.__from__ === 'url' ? constants.LIST_PUSH : constants.LIST_UPDATE;

      dispatch({
        type: 'EXTENSION_TEST_UPDATE'
      });


      dispatch({
        type,
        proxy
      });
    });
  }

  shouldComponentUpdate (nextProps) {
    if (
      nextProps.list === this.props.list
    ) {
      return false;
    }

    return true;
  }

  onSubjectClick = (li) => {
    const { dispatch } = this.props;

    li.toggled = !li.toggled;

    dispatch({
      type: constants.LIST_TOGGLED,
      subject: li
    });
  }

  onToggled = (toggled) => {
    const { dispatch } = this.props;

    dispatch({
      type: constants.LIST_SEARCH_TOGGLED,
      toggled
    });
  };

  onSearch = (value) => {
    const { dispatch } = this.porps;

    dispatch({
      type: constants.LIST_ONSEARCH,
      value
    });
  }

  itemRender (list, group) {
    const { match, location, dispatch } = this.props;

    return list.map((li, index) => {
      let url;
      const query = queryString.parse(location.search);

      query.overlay = 'visiable';
      query.group = group;
      query.id = index;
      url = `/list?${queryString.stringify(query)}`;

      const props = {
        id: index,
        code: li.code,
        message: li.message,
        url: li.url,
        ip: li.ip,
        method: li.method,
        path: li.path,
        extension: li.extension,
        requestHeaders: li.requestHeaders,
        responseHeaders: li.responseHeaders,
        route: url,
        group,
        match,
        location,
        dispatch
      };

      return (
        <Item {...props} key={index}/>
      );
    });
  }

  groupRender () {
    const { list } = this.props;

    const groupElement = list.map((li, index) => {
      const itemElement = this.itemRender(li.list, index);
      const classes = classnames({
        [classNameSpace('item-group')]: true,
        [classNameSpace('item-group', 'invisible')]: !!li.toggled
      });

      return (
        <div className={classes} key={index}>
          <div className={classNameSpace('item-group-title')}>
            <div className={classNameSpace('item-group-subject')}>
              <img src={`/ico?url=${li.subject}`} alt={li.subject} className={classNameSpace('item-group-subject-ico')}/>
              <div className={classNameSpace('item-group-subject-text')}>
                {li.subject} 
                <i className="iconfont icon-more-fill app__list-item-group-subject-icon" onClick={() => this.onSubjectClick(li)}></i>
              </div>
              {/*<span className={classNameSpace('item-group-number')}>{li.list.length}</span>*/}
            </div>
          </div>
         
          <div className={classNameSpace('item-group-content')}>
            {itemElement}
          </div>
        </div>
      );
    });

    return groupElement;
  }

  render () {
    const { search, location } = this.props;
    const qs = queryString.parse(location.search);
    const classes = classnames({
      [classNameSpace('toolbar')]: true,
      [classNameSpace('toolbar', 'toggled')]: !!qs.tool
    });

    return (
      <div className={classNameSpace()}>
        <div className={classes}>
          <SearchBar {...search} onToggled={this.onToggled} onSearch={this.onSearch} location={location}/>
          <Tools />
        </div>

        <div className={classNameSpace('view')}>
          {this.groupRender()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list, socket } = state;
  const { subjects, keys, search } = list;

  return {
    list: subjects,
    keys,
    socket,
    search
  };
}

export default withRouter(connect(mapStateToProps)(List));