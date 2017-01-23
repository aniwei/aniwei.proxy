import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router';

import { Panel, PanelHeader, PanelBody, MediaBox, MediaBoxTitle, MediaBoxDescription } from 'react-weui';
import { Radio, Switch, CellBody, CellFooter, CellHeader, FormCell, Checkbox, Form, CellsTitle, TextArea } from 'react-weui';

import 'whatwg-fetch';

import * as actions from '../../../actions';

class Host extends React.Component {
  static defaultProps = {
    name: 'host'
  }

  panelsRender () {
    const { configure } = this.props;
    let list    = configure.hosts,
        maps    = {},
        element = [];

    return list.map((k, i ) => {
      let panel = {
        tag: k.group,
        on: k.on,
        rules: k.rules
      }
      return this.panelRender(panel, i)
    });
  }

  panelRender (panel, i) {
    let bodyElement,
        text;  

    bodyElement = panel.rules.map((u, i) => {
      let text = '';

      if (!u.on) {
        text = '# ';
      }

      Object.keys(u).forEach(function (key) {
        if (key == 'on') {
          return this;
        }

        text += key + ' ' + u[key];
      });

      return text;
    });

    return (
      <Form checkbox>
      <Panel access key={i}>
        <PanelHeader>
          <FormCell checkbox className="app__midway-cell">
            <CellBody>{panel.tag}</CellBody>
              <CellFooter>
                <Checkbox name={`checkbox-${i}`} value={i} checked={panel.on}/>
              </CellFooter>
          </FormCell>
        </PanelHeader>
        <PanelBody checkbox>
          <FormCell>
            <CellBody>
              <TextArea className="app__midway-textarea" placeholder="Enter your hosts" rows={bodyElement.length}>
                {bodyElement.join('\r')}
              </TextArea>
            </CellBody>
          </FormCell>
        </PanelBody>
      </Panel>
      </Form>
    );
  }

  render () {
    const { configure, text, toSelect } = this.props;
    let element;

    if (configure) {
      element = this.panelsRender();
    }

    return (
      <div className="app__midway app__midway-host">
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

export default connect(mapStateToProps, mapDispatchToProps)(Host);