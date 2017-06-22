import React, { createElement } from 'react';
import { Subject, Listview, Item, Text, Select, Tag } from 'aniwei-proxy-extension-context';

function Group (props) {
  return (
    <Item vertical>
      <Item.Body>

      </Item.Body>
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
  Group,
  MatchType,
  MatchContent,
  ResponseType,
  ResponseContent
}