import { composeWithTracker } from 'react-komposer';
import { CommunityUsers } from '../components/community-users';
import { Communities } from '../../api/communities/communities';
import { LolProfile } from '../../api/lolProfile/lolProfile';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (props, onData) => {

  const subscription = Meteor.subscribe('communities');
  const subUser = Meteor.subscribe('userList');
  const subLolProfil = Meteor.subscribe('lolProfile');
  let community= {};

  load = () =>{
    const data = {};

    community = Communities.findOne({name:props.communityName});
    console.log(community.user_id);

    let users = [];
    users = Meteor.users.find({ _id: { $in: community.user_id }}).fetch();

console.log("user",users);
    let summonerIds = [];
    users.forEach(function(user) {
      console.log("boucle user", user);
      console.log("boucle user", user.profile);

      summonerIds.push(user.profile.summonerId);
    });
/*
    for(let Document in users){
      console.log("test", Document);
      console.log(users[0]);
      summonerIds.push(user.profile.summonerId);
    }
    */

    console.log(summonerIds);

    let summoners = [];
    summoners = LolProfile.find({ summonerId: { $in: summonerIds}}).fetch();
    console.log("summoner a envoyer",summoners);

//TODO it sucks
    for(summoner in summoners){

      users.forEach(function(user) {
        if(summoner.summonerId = user.profile.summonerId)
          summoner.communityName = user.profile.communityName;
      });
    }

console.log(summoners);

    onData(null, { summoners });
  }

  if (subscription.ready() && subLolProfil.ready() )
    load();
};

export default CommunityUsersContainer = composeWithTracker(composer, Loading)(CommunityUsers);
