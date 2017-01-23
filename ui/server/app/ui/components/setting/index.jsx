import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'

import 'whatwg-fetch';
import './css/index.css';

import * as actions from '../../actions';

class setting extends React.Component {
  componentDidMount () {
    const { setting, toUpdate, toActive  } = this.props;

    if (!setting) {
      fetch('/setting', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        return res.json()
      })
      .then((res) => {
        toActive(true);
        toUpdate(res.data);
      })
      .catch(() => {

      });
    }
  }

  settingRender () {
    const { setting } = this.props;
    let settingElement;

    if (setting) {
      settingElement = setting.map((plg, i) => {
        return (
          <div className="app__setting-item">
            <Link to={`/setting/${plg.link}`}>
              <i className={`iconfont app__setting-icon app__setting-icon-${plg.icon} icon-${plg.icon}`}></i>
              <span className="app__setting-text">{plg.text}</span>
            </Link>
          </div>
        );
      });

      return (
        <div className="app__setting-listview">
          {settingElement}
        </div>
      );
      
      
    }
  }

  render () {
    return (
      <div className="app__setting">
        <div className="app__setting-title">设置</div>
        {this.settingRender()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    setting: state.setting
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    toUpdate: actions.settingUpdate,
    toActive: actions.sidebarActive
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(setting);