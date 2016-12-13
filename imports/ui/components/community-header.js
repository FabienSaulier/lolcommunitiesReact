import React from 'react';
import { Row, Col, ListGroupItem, FormControl, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
//import { joinCommunity, updateCommunity, removeCommunity } from '../../api/communities/methods.js';
import { Meteor } from 'meteor/meteor';



//TODO onclick: pass _id as parameter

export const CommunityHeader = ({ community , actionBtn }) => (
  <div>
    <div className='ui image'>
      <img src={"/communities_logo/"+community.picture} />
    </div>
    <a className="ui big label" href={community.url} target="_blank" >{community.name}</a>
    {displayActionBtn(actionBtn, community)}
  </div>
);

const displayActionBtn = (actionBtn, community) => {
  if( actionBtn === "join")
    return <JoinCommunityBtn joinCommunity={community.handleJoinCommunity} name={community.name} />
  else if(actionBtn === "youarein")
    return <YouAreInBtn name={community.name}  />
  else
    return <LoginBtn name={community.name}  />
}

const JoinCommunityBtn = (props) => (
  <button onClick={props.joinCommunity} className="ui primary button">
    Join {props.name}
  </button>
);

const LoginBtn = (props) => (
  <button className="ui primary button">
    You need to login in order to join {props.name}
  </button>
);

const YouAreInBtn = (props) => (
  <button>
    You are part of this community
  </button>
);
