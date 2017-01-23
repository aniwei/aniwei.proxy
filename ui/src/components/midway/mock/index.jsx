import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router';

import { Panel, PanelHeader, PanelBody, MediaBox, MediaBoxTitle, MediaBoxDescription } from 'react-weui';
import { Radio, Switch, CellBody, CellFooter, CellHeader, FormCell, Checkbox } from 'react-weui';

import 'whatwg-fetch';

import * as actions from '../../../actions';

class Mock extends React.Component {
  static defaultProps = {
    name: 'mock'
  }

  panelsRender () {
    const { configure } = this.props;
    let list    = configure.interfaces,
        maps    = {},
        element = [];

    list.forEach(function (i) {
      let ref = maps[i.tag] || (maps[i.tag] = []);

      ref.push(i);
    });

    return Object.keys(maps).map((k, i ) => {
      let panel = {
        tag: k,
        url: maps[k]
      }
      return this.panelRender(panel, i)
    });
  }

  panelRender (panel, i) {
    let bodyElement;

    bodyElement = panel.url.map((u, i) => (
        <FormCell checkbox key={i}>
          <CellHeader>
            <Checkbox name="checkbox1" value="1"/>
          </CellHeader>
          <CellBody>标题文字</CellBody>
        </FormCell>
    ));

    return (
      <Panel access key={i}>
        <PanelHeader>{panel.tag}</PanelHeader>
        <PanelBody>
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
      <div className="app__midway app__midway-json">
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

export default connect(mapStateToProps, mapDispatchToProps)(Mock);