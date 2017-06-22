import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';
import { Subject, Listview, Item, Text, Select, Tag } from 'aniwei-proxy-extension-context';

import formItemMap from './form-item-map';

const classNamespace = namespace('sim-editor-rule');

class FormItem extends React.Component {
  constructor () {
    super();

    this.state = {
      responseType: 1
    };
  }

  subjectRender () {
    const { dataSource } = this.props;
    
    return dataSource.map((data, i) => {
      const itemElement = data.formItem.map((it) => {
        return (
          createElement(formItemMap[it.component], it)
        );
      });

      return (
        <Subject title={data.text} name={data.subject} key={data.subject}>
          <Listview>
            {itemElement}
          </Listview>
        </Subject>
      );
    });
  }

  render () {
    
    return (
      <div className={classNamespace()}>
        {this.subjectRender()}
      </div>
    );
  }
}

export default FormItem;