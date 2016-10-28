import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';

import * as actions from '../../actions';

import './css/index.css'

class Navigation extends React.Component {

  itemRender () {
    const { navigation, onTouchTap } = this.props;

    return navigation.map((nav, i) => {
      let key   = `navigation-item-${i}`,
          icon  = <FontIcon className="material-icons">{nav.icon}</FontIcon>

      return <BottomNavigationItem
        key={key}
        label={nav.label}
        icon={icon}
        onTouchEnd={() => {onTouchTap(i)}}
      />
    });
  }

  render () {
    const { current } = this.props;

    return <div className="view__navigation">
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={current}>
          {this.itemRender()}
        </BottomNavigation>
      </Paper>
    </div>
  }
}

function mapStateToProps (state) {
  return {
    navigation: state.navigation,
    current:    state.navigationItem
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onTouchTap: actions.navigationTouchTap
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
