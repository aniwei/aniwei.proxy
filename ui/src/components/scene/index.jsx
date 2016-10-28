import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';

import './css/index.css';

class Scene extends React.Component {
  sceneRender () {
    const { scenes, current } = this.props;
    let style

    return scenes.map((scene, index) => {
      let style = {display: current == index ? 'block': 'none'}
      return <div className="view__scene-stage" style={style} key={index}>
        {scene}
      </div>
    });
  }

  render () {
    const { onChange, current } = this.props

    return <div className="view__scene">
        {this.sceneRender()}
    </div>
  }
}

function mapStateToProps (state, own) {
  return {
    scenes:     state.navigation.map(nav => nav.scene),
    current:    state.navigationItem
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onChange: actions.navigationTouchTap
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
