import { composeWithTracker } from 'react-komposer';
import { CommunityUsers } from '../components/community-users';
import { Communities } from '../../api/communities/communities';
import { LolProfile } from '../../api/lolProfile/lolProfile';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (props, onData) => {

  const subscription = Meteor.subscribe('communities');
  const subLolProfil = Meteor.subscribe('lolProfile');
  const subUersData = Meteor.subscribe('usersData');
  let community= {};

  load = () =>{

    const data = {};
    community = Communities.findOne({name:props.communityName});
    let users = [];
console.log("caeae");
    console.log(community.user_id);
    users = Meteor.users.find({ _id: { $in: community.user_id }}).fetch();
    console.log(users);
    let summonerIds = [];
    users.forEach(function(user) {
      summonerIds.push(user.profile.summonerId);
    });
    let summoners = [];
    summoners = LolProfile.find({ summonerId: { $in: summonerIds}}).fetch();

//TODO it sucks
    for(summoner in summoners){
      users.forEach(function(user) {
        if(summoner.summonerId = user.profile.summonerId)
          summoner.communityName = user.profile.communityName;
      });
    }

    onData(null, { summoners });
  }

  if (subscription.ready()  && subUersData.ready() && subLolProfil.ready() )
    load();
};

export default CommunityUsersContainer = composeWithTracker(composer, Loading)(CommunityUsers);
