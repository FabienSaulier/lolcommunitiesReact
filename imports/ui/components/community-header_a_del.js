import React from 'react';
import { Row, Col, ListGroupItem, FormControl, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import {Signup} from '../pages/signup';


//TODO onclick: pass _id as parameter

//TODO c'est mort non ? a del.


export const CommunityHeader = ({ community , actionBtn }) => (
  <div>
    <div className='ui image'>
      <img src={"/communities_logo/"+community.picture} />
    </div>
    <a className="ui big label" href={community.url} target="_blank" >{community.name}</a>
    {displayActionBtn(actionBtn, community)}
    <Signup />
  </div>
);

const displayActionBtn = (actionBtn, community) => {
  if( actionBtn === "join")
    return <JoinCommunityBtn joinCommunity={community.handleJoinCommunity} name={community.name} />
  else if(actionBtn === "youarein")
    return <YouAreInBtn name={community.name}  />
  else
    return <LoginBtn name={community.name} openModal={community.openModal} />
}

const JoinCommunityBtn = (props) => (
  <Button onClick={props.joinCommunity} className="ui primary button">
    Join {props.name}
  </Button>
);

const LoginBtn = (props) => (
  <Button onClick={props.openModal}   className="ui primary button">
    You need to login in order to join {props.name}
  </Button>
);

const YouAreInBtn = (props) => (
  <Button>
    You are part of this community
  </Button>
);
