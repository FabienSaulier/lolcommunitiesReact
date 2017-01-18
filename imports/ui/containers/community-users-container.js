import { composeWithTracker } from 'react-komposer';
import { CommunityUsers } from '../components/community-users.js';
import { Communities } from '../../api/communities/communities.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (props, onData) => {

  const subscription = Meteor.subscribe('communities');
  const subUser = Meteor.subscribe('userList');
  let community= {};

  load = () =>{
    const data = {};
    community = Communities.findOne({name:props.communityName});
    console.log(community.user_id);
    let users = [];
    users = Meteor.users.find({ _id: { $in: community.user_id }}).fetch();
    onData(null, { users });
  }

  if (subscription.ready() && subUser.ready() )
    load();
};

export default CommunityUsersContainer = composeWithTracker(composer, Loading)(CommunityUsers);
