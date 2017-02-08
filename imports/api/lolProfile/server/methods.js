import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';

const riotApiKey = Meteor.settings.riotApiKey;

export const createSummonerProfile = (user, userCommunityName) => {
  let summonerProfileData = getSummonerProfileData(user.profile.server, user.profile.summonerId);
  summonerProfileData.userCommunityName = userCommunityName;
  LolProfile.insert(summonerProfileData);
}

export const updateSummonerProfile = (user) =>{
  const summonerProfileData = getSummonerProfileData(user.profile.server, user.profile.summonerId);
  LolProfile.update({summonerId: user.profile.summonerId}, {$set: summonerProfileData}, {validate: false});
}

const getSummonerProfileData = (server, summonerId) => {

  const riotApiUrl = "https://"+"na"+".api.pvp.net/api/lol/"+server+"/v2.5/league/by-summoner/"+summonerId+"/entry?api_key="+riotApiKey;
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
    if(e.response.data.status.status_code == 404){
      // user has no ranked stats
      summonerProfileData = {
        'server': server.toUpperCase(),
        'summonerId': summonerId,
        'summonerName': Meteor.user().profile.summonerName,
        'queue': "UNRANKED"
      }
      return summonerProfileData;
    } else{
      console.log(e);
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
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
