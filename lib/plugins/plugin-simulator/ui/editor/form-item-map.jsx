import React, { createElement } from 'react';
import Item from './form/form-item';
import Listview from './form/form-list';
import Text from './form/form-text';
import Select from './form/form-select';

function Name (props) {
  return (
    <Item>
      <Text />
    </Item>
  );
}

function MatchType (props) {
  const { options } = props;
  const optionElement = options.map(opt => {
    return (
      <Select.Option value={opt.value} key={opt.key}>
        {opt.text}
      </Select.Option>
    );
  });

  return (
    <Item type="select" vertical>
      <Item.Header>
        <Select>
            {optionElement}
        </Select>  
      </Item.Header>
    </Item>
  );
}

function MatchContent (props) {
  const { options } = props;

  return (
    <Item type="select" vertical>
      <Item.Body>
        <Text multiLine />
      </Item.Body>
    </Item>
  );
}

function ResponseType (props) {
  const { options } = props;
  const optionElement = options.map(opt => {
    return (
      <Select.Option value={opt.value} key={opt.key}>
        {opt.text}
      </Select.Option>
    );
  });

  return (
    <Item type="select" vertical>
      <Item.Header>
        <Select>
            {optionElement}
        </Select>  
      </Item.Header>
    </Item>
  );
}

function ResponseContent (props) {

  return (
    <Item type="select" vertical>
      <Item.Body>
        <Text multiLine onInput={() => props.onResponseContentInput(e)}/>
      </Item.Body>
    </Item>
  );
}

export default {
  Name,
  MatchType,
  MatchContent,
  ResponseType,
  ResponseContent
}