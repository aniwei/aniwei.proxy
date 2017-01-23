import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router';

import { Panel, PanelHeader, PanelBody, MediaBox, MediaBoxTitle, MediaBoxDescription } from 'react-weui';
import { Radio, Switch, CellBody, CellFooter, CellHeader, FormCell, Checkbox, Form, CellsTitle } from 'react-weui';

import 'whatwg-fetch';

import * as actions from '../../../actions';

class Replace extends React.Component {
  static defaultProps = {
    name: 'replace'
  }

  panelsRender () {
    const { configure } = this.props;
    let list    = configure.rules,
        maps    = {},
        element = [];

    return list.map((k, i ) => {
      let panel = {
        tag: k.group,
        rules: k.rules
      }
      return this.panelRender(panel, i)
    });
  }

  panelRender (panel, i) {
    let bodyElement;

    bodyElement = panel.rules.map((u, i) => (
      <MediaBox type="text">
          <MediaBoxDescription>
              {u.rule}
          </MediaBoxDescription>
          <MediaBoxDescription>
              {u.uri}
          </MediaBoxDescription>
      </MediaBox>
    ));

    return (
      <Panel access key={i}>
        <PanelHeader>
            {panel.tag}
        </PanelHeader>
        <PanelBody checkbox>
          {bodyElement}
        </PanelBody>
      </Panel>
    );
  }

  render () {
    const { configure, text, toSelect } = this.props;
    let element;

    if (configure) {
      element = this.panelsRender();
    }

    return (
      <div className="app__midway app__midway-replace">
        <div className="app__midway-title">
          {text}
          <i className="iconfont icon-close app__midway-close" onClick={() => toSelect(null)}></i>
        </div>
        {element}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    toSelect: actions.pluginSelected
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Replace);