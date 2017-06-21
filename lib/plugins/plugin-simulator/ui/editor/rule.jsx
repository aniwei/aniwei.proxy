import React, { createElement } from 'react';
import { clone } from 'lodash';
import { register, namespace } from 'aniwei-proxy-extension-context';

const classNamespace = namespace('sim-editor-rule');

class Rule extends React.Component {
  
  render () {
    return (
      <div className={classNamespace()}>
        <div className={classNamespace('subject')}>
          <div className={classNamespace('subject-title')}>
            选择分组
          </div>
          
          <div className={classNamespace('subject-listview')}>
            <div className={classNamespace('subject-item')}>
              <div className={classNamespace('subject-item-header')}>
                规则分组
              </div>

              <div className={classNamespace('subject-item-body')}>

              </div>
            </div>
          </div>

          <div className={classNamespace('subject-brief')}>
            说明事项
          </div>
        </div>

        <div className={classNamespace('subject')}>
          <div className={classNamespace('subject-title')}>
            匹配类型
          </div>
          
          <div className={classNamespace('subject-listview')}>
            <div className={classNamespace([['subject-item'], ['subject-select-item'], ['subject-select-areatext-item']])}>
              <div className={classNamespace('subject-item-header')}>
                <select className={classNamespace('subject-select')} name="type">
                  <option value="1">正则匹配</option>
                  <option value="2">字符匹配</option>
                </select>
              </div>

              <div className={classNamespace('subject-item-body')}>
                
              </div>
            </div>
          </div>

          <div className={classNamespace('subject-brief')}>
            说明事项
          </div>
        </div>
      </div>
    );
  }
}

export default Rule;