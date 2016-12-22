import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { joinCommunity } from '../../api/communities/methods.js';
import { CommunityHeader } from '../components/community-header.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

let communityId = "";


// prendre un parameter ?
const handleJoinCommunity = () =>{
  joinCommunity.call({
    _id: communityId,
    userId: Meteor.userId(),
  }, (error) => {
    if (error) {

      //TODO gérer le cas où l'user est déjà dedans (mettre un unique dans le model?)
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Join the community!', 'success');
    }
  });

}


const getInitialState =() => {
  return {
    titi : "toto"
  }
}

const openModal = () => {
  alert("coucou ma poule : ");
  console.log(this.state.titi);
  this.setState({titi:"maeaze"});

}

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('communities');
  let community= {};


  load = () =>{
    community = Communities.findOne({name:params.communityName});
    community.handleJoinCommunity = handleJoinCommunity;
    community.openModal = openModal;
    communityId = community._id;



    if(Meteor.user() &&  !Meteor.user().profile.community_id.includes(communityId))
      actionBtn = "join";
    else if (Meteor.user() &&  Meteor.user().profile.community_id.includes(communityId))
      actionBtn = "youarein";
    else
      actionBtn = "signup";
// signed up but not in the community
// signed up and in the community
// nto signed up: 'sign up and join this community'
// a mettre un test si not signed up and in the community

    onData(null, { community , actionBtn});
  }

  if (subscription.ready())
    load();
}



export default CommunityHeaderContainer = composeWithTracker(composer, Loading)(CommunityHeader);
