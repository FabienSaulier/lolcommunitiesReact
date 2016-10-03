import React from 'react';
import ReactDOM from 'react-dom';
import CommunitiesList from '../containers/communities-list.js';
import { AddCommunity } from '../components/add-community.js';



export const Community = ({community}) => (
  <div>
    This is the detail page of the community! {community}
  </div>
);
