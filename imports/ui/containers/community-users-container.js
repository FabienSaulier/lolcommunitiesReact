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

    /** Get the users of the community.**/
    let users = [];
    //TODO optimiser la requete, pas besoins de tout le user.
    users = Meteor.users.find({ _id: { $in: community.user_id }}).fetch();

    /** build a map of userCommunityName and summonerId for each users. **/
    let summonerIds = [];
    let mapUserCommunityName_summonerId = [];
    users.forEach(function(user) {
      summonerIds.push(user.profile.summonerId);
      for(i=0; i<user.profile.communities.length; i++){
        if(user.profile.communities[i]._id == community._id){
          mapUserCommunityName_summonerId.push({'summonerId':user.profile.summonerId, 'userCommunityName': user.profile.communities[i].userName});
          break;
        }
      }
    });

    /** Get the lolProfiles for each users and set the userCommunityName accordingly. **/
    let summonersProfiles = [];
    summonersProfiles = LolProfile.find({ summonerId: { $in: summonerIds}}).fetch();

  // Handle the case where multiple user have the same summonerId. Yeah, it shouldn't not.
  // But for now, it's possible. before a verification to confirm the legitimate owner of the riot summoner id
    let summoners =[];
    mapUserCommunityName_summonerId.forEach(function(userCommunityName_userId){
      for(i=0; i<summonersProfiles.length; i++){
        if(summonersProfiles[i].summonerId == userCommunityName_userId.summonerId){
          // need a copie for when different users share the same summonerID
          let copie = Object.assign({}, summonersProfiles[i]);
          copie.userCommunityName = userCommunityName_userId.userCommunityName;
          summoners.push(copie);
          break;
        }
      }
    })

    // extract the different queue for presentation array.
    for(summoner of summoners){
      for(league of summoner.leagues){
        if (league.queue == 'RANKED_SOLO_5x5'){
          summoner.league5v5 = league;
        }
        if (league.queue == 'RANKED_FLEX_TT'){
          summoner.league3v3 = league;
        }
        if (league.queue == 'RANKED_FLEX_SR'){
          summoner.league5v5flex = league;
        }
        delete summoner.leagues;
      }
    }
    onData(null, { summoners });
  }

  if (subscription.ready()  && subUersData.ready() && subLolProfil.ready() )
    load();
};

export default CommunityUsersContainer = composeWithTracker(composer, Loading)(CommunityUsers);
