import React from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { insertCommunity } from '../../api/communities/methods.js';


/**
currently not userd
**/

const handleInsertCommunity = (event) => {
  const target = event.target;
  const name = target.value.trim();

  if (name !== '' && event.keyCode === 13) {
    insertCommunity.call({
      name,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        target.value = '';
        Bert.alert('Community added!', 'success');
      }
    });
  }
};

export const AddCommunity = () => (
  <FormGroup>
    <FormControl
      type="text"
      onKeyUp={ handleInsertCommunity }
      placeholder="Type a community name and press enter..."
    />
  </FormGroup>
);
