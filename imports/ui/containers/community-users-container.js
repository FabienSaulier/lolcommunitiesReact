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

// load data required for the array listing the summoner of a community.
  load = () =>{

    community = Communities.findOne({name:props.communityName});
    let users = [];
    //TODO optimiser la requete, pas besoins de tout le user.
    users = Meteor.users.find({ _id: { $in: community.user_id }}).fetch();

    let summonerIds = [];

    let mapUserCommunityName_userId = [];

    users.forEach(function(user) {
      summonerIds.push(user.profile.summonerId);

      for(i=0; i<user.profile.communities.length; i++){
        if(user.profile.communities[i]._id == community._id){
          mapUserCommunityName_userId.push({'summonerId':user.profile.summonerId, 'userCommunityname': user.profile.communities[i].userName});
          break;
        }
      }
    });

console.log(mapUserCommunityName_userId);

    let summoners = [];
    // ici! on a qu'un summonerid
    summoners = LolProfile.find({ summonerId: { $in: summonerIds}}).fetch();

    summoners.forEach(function(summoner){
      console.log(summoner);
      for(i=0; i<mapUserCommunityName_userId.length; i++){
        if(mapUserCommunityName_userId[i].summonerId == summoner.summonerId){
          console.log('add '+mapUserCommunityName_userId[i].userCommunityname);
          summoner.userCommunityName = mapUserCommunityName_userId[i].userCommunityname;
          break;
        }
      }
    })

/*
    for(summoner in summoners){
      users.forEach(function(user) {
        if(summoner.summonerId = user.profile.summonerId)
          summoner.communityName = user.profile.communityName;
      });
    }
    */

    onData(null, { summoners });
  }

  if (subscription.ready()  && subUersData.ready() && subLolProfil.ready() )
    load();
};

export default CommunityUsersContainer = composeWithTracker(composer, Loading)(CommunityUsers);
