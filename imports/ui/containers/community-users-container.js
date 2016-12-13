import { composeWithTracker } from 'react-komposer';
import { CommunityUsers } from '../components/community-users.js';
import { Communities } from '../../api/communities/communities.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {

  const subscription = Meteor.subscribe('communities');
  //const subUser = Meteor.subscribe('users');

  let community= {};
console.log("before load");

  load = () =>{
    const data = {};
    community = Communities.findOne({name:params.communityName});
console.log("on a recup la community: ");
console.log(community.user_id);

    let users = [];
//    if(typeof community.user_id  !== 'undefined'){
      users = Meteor.users.find({ _id: { $in: community.user_id }}).fetch();
      console.log(users);
//    }


    onData(null, { users });
  }


  if (subscription.ready() )
    load();



// la subscription a users est toujours présente.
//  const subscription = Meteor.subscribe('users');
//  if (subscription.ready()) {
//    const users = Meteor.users.find().fetch();
//    onData(null, { users });
//  }
};

export default composeWithTracker(composer, Loading)(CommunityUsers);
