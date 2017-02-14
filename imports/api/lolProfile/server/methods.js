import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';

const riotApiKey = Meteor.settings.riotApiKey;

export const createSummonerProfile = (user, userCommunityName) => {
  let summonerProfileData = getSummonerProfileData(user.profile.summonerId, user.profile.server);
  summonerProfileData.userCommunityName = userCommunityName;
  LolProfile.insert(summonerProfileData);
}

export const updateSummonerProfile = (summonerId, summonerServer) =>{
  const summonerProfileData = getSummonerProfileData(summonerId, summonerServer);
  LolProfile.update({summonerId: summonerId}, {$set: summonerProfileData}, {validate: false});
}

export const refreshSummonerProfile = new ValidatedMethod({
  name: 'summonerProfile.refresh',
  validate:null,
  run({summonerId, summonerServer }) {
    console.log("refreshSummonerProfile");
    updateSummonerProfile(summonerId, summonerServer);
  },
});

const getSummonerProfileData = (summonerId, server) => {
  const riotApiUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v2.5/league/by-summoner/"+summonerId+"/entry?api_key="+riotApiKey;
  try {
    var result = HTTP.call("GET", riotApiUrl);
    let summonerProfileData = {};

    for(i in result.data[summonerId]){
      if(result.data[summonerId][i].queue == 'RANKED_SOLO_5x5'){
        let league = result.data[summonerId][i];
        let stats = league.entries[i];
        summonerProfileData = {
          'server': server,
          'summonerId': stats.playerOrTeamId,
          'summonerName': stats.playerOrTeamName,
          'queue': league.queue,
          'tier': league.tier,
          'leagueName': league.name,
          'division': stats.division,
          'leaguePoints': stats.leaguePoints,
          'wins': stats.wins,
          'losses': stats.losses
        }
      }
    }
    return summonerProfileData;

  } catch (e) {

    if(e.response.statusCode == '429'){
      console.log('Riot Api is overloaded, wait one minute to refresh');
      throw new Meteor.Error('riot.api ', 'Riot Api is overloaded, wait one minute to refresh');
    }
    //TODO a check, queue unranked ???
    else if(e.response.statusCode == 404){
      // user has no ranked stats
      summonerProfileData = {
        'server': server.toUpperCase(),
        'summonerId': summonerId,
        'summonerName': Meteor.user().profile.summonerName,
        'queue': "UNRANKED"
      }
      return summonerProfileData;
    } else{
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log('at: '+riotApiUrl);
      console.log(e);
      throw new Meteor.Error('riot.api ', 'Unknown error from Riot api.');
    }
  }
}

export const hasUserLolProfile = new ValidatedMethod({
  name: 'LolProfile.hasUserLolProfile',
  validate:null,
  run({user}) {
      const userLolProfile = LolProfile.findOne({summonerId: user.profile.summonerId});
      if(userLolProfile)
        return true;
      else
        return false;
  }
})
