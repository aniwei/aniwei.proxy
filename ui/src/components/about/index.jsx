import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBar from 'material-ui/AppBar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import More from './more';
import * as actions from '../../actions';
import drawers from './drawer';

import './css/index.css';

const style = {
  background: 'rgba(255, 255,255, 0)',
  boxShadow: 'none'
}

class About extends React.Component {
  drawersRender () {
    const { drawer, onItemTouchTap, menuItem } = this.props;

    return menuItem.map((m, i) => {
      const props = {
        onItemTouchTap,
        title:  m.text,
        open:   m.value == drawer,
        key:    i
      }

      return React.createElement(drawers[m.value], props)
    })
  }

  render () {
    const { project, organization, version, menuItem, onItemTouchTap } = this.props;
    const props = {
      menuItem,
      onItemTouchTap
    }

    return <div className="view__about">
      <AppBar style={style}
        showMenuIconButton={false}
        iconElementRight={<More {...props}/>}
      />
      <div className="view__about-logo">
        <div className="view__about-logo-image"></div>
        <span className="view__about-logo-text">{project.value}</span>
      </div>
      <div className="view__about-info">
        <div className="view__about-originization">
          {organization.value}
        </div>
        <div className="view__about-version">
          Version - {version.value}
        </div>
      </div>
      {this.drawersRender()}
    </div>
  }
}

function mapStateToProps (state) {
  let about = state.about;

  return {
    project: about.project,
    author: about.author,
    version: about.version,
    organization: about.organizationUnit,
    drawer: about.drawer,
    menuItem: about.moreMenuItem
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onItemTouchTap: actions.aboutMoreTouchTap,
    progressDisplay: actions.progressDisplay
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(About)
