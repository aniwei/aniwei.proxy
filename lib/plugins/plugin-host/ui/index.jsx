import React, { createElement, PropTypes, Component } from 'react';
import queryString from 'query-string';
import classnames from 'classnames';
import { assign } from 'lodash';
import { clone } from 'lodash';
import { Link } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { register, namespace } from 'aniwei-proxy-extension-context';

import './less/index.less';

import Editor from './editor';
import Rules from './rules';
import Helpful from './helpful';

const classNamespace = namespace('host');

class Host extends Component {
  onRuleAppended = (rule) => {
    const { settings, dispatch } = this.props;
    const { rules } = settings;
    
    rules[rules.length] = rule;
    
    this.rulesUpdate(rules);
  }

  onRuleUpdated (rule, index) {
    const { settings } = this.props;
    const { rules } = settings;

    rules[index] = rule;

    this.rulesUpdate(rules);
  }

  onAppenderClick = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: {
        onSubmit: this.onRuleAppended
      }
    });
  }

  navigationItemClick (item, e) {
    const { dispatch, settings, location } = this.props;
    const { navigations } = settings;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    dispatch({
      type: 'EXTENSION_HOST_TAB_CHANGE',
      navigations
    });

    switch (item.action) {
      case 'HELPFUL':
        fetch('/plugin/host/README.md')
          .then(res => res.text())
          .then(res => {
            dispatch({
              type: 'LAYER_OVERLAYED',
              component: Helpful,
              defaultProps: {
                html: res
              } 
            });

            window.location.href = `#${location.pathname}?${queryString.stringify(qs)}`;
          });

        break;
        
      default:
        navigations.forEach(nav => nav.selected = false);
        item.selected = !item.selected;
        break;
    }
  }

  rulesEditer = (rule, index) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LAYER_OVERLAYED',
      component: Editor,
      defaultProps: assign({
        onSubmit: (rule) => {
          this.onRuleUpdated(rule, index);
        }
      }, rule)
    });
  }

  rulesUpdate (rules) {
    const { dispatch } = this.props;

    fetch('/plugin/host/update', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rules: rules
      })
    })
    .then(res => res.json())
    .then(res => {
      dispatch({
        type: 'EXTENSION_HOST_RULE_UPDATE'
      });

      history.back();
    });
  }

  appenderRender () {
    const { location } = this.props;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;

    return (
      <Link to={uri} className={classNamespace('appender')} onClick={this.onAppenderClick}>
      </Link>
    );
  }

  listviewRender () {
    const { location, settings, dispatch } = this.props;
    const qs = queryString.parse(location.search);

    qs.layer = 'visiable';

    const uri = `${location.pathname}?${queryString.stringify(qs)}`;
    let element;

    if (
      settings.rules && 
      settings.rules.length > 0
    ) {
      const props = {
        rules: settings.rules,
        rulesEditer: this.rulesEditer,
        location,
        dispatch
      };

      element = <Rules {...props} />;
    }

    return (
      <div className={classNamespace('listview')}>
        {element}
      </div>
    );
  }

  navigationRender () {
    const { settings, } = this.props;
    const { navigations } = settings;

    const elements = navigations.map((nav, index) => {
      const selected = nav.selected;
      const classes = classnames({
        [classNamespace('navigation-item', 'selected')]: selected,
        [classNamespace('navigation-item')]: true
      });

      return (
        <div className={classes} key={nav.key} onClick={(e) => this.navigationItemClick(nav, e)}>
          <i className={nav.icon}></i>
          <span className={classNamespace('navigation-item-text')}>{nav.text}</span>
        </div>
      );
    });

    return (
      <div className={classNamespace('navigation')}>
        {elements}
      </div>
    );
  }

  render () {
    return (
      <div className={classNamespace()}>
        
        {this.navigationRender()}
        {this.listviewRender()}
        {this.appenderRender()}
      </div>
    );
  }
}

const reducers = {
  [`RULE_UPDATE`]: (state, action) => {
    // let cmpt;

    // state.some((cmp) => {
    //   if (cmp.name === 'host') {
    //     return cmpt = cmp;
    //   }
    // });

    // const { settings } = cmpt;
    // const index = action.index;

    // settings.rules[index] = action.rule;

    return clone(state);
  },

  [`TAB_CHANGE`]: (state, action) => {
    return clone(state);
  }
};


export default register(reducers)('host', Host);