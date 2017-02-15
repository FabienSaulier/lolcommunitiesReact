import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';

const riotApiKey = Meteor.settings.riotApiKey;

export const createSummonerProfile = (user, userCommunityName) => {
  let summonerProfileData = getSummonerProfileData(user.profile.summonerId, user.profile.server);
  summonerProfileData.summonerName = user.profile.summonerName; // ensure the summonerName cause we can't retrieve it from riot if user has no ranked stats.
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
    let summonerQueues = result.data[summonerId];
    // at least 1 queue otherwise it's in 404

    summonerProfileData = {
      'server': server,
      'summonerId': summonerQueues[0].entries[0].playerOrTeamId,
      'summonerName': summonerQueues[0].entries[0].playerOrTeamName,
      'leagues':[]
    }
    for(i in summonerQueues){
      let league = summonerQueues[i];
      let stats = league.entries[0]; // it's always 1 player, not a team.
      summonerProfileData.leagues.push({
        'queue': league.queue,
        'tier': league.tier,
        'leagueName': league.name,
        'division': stats.division,
        'leaguePoints': stats.leaguePoints,
        'wins': stats.wins,
        'losses': stats.losses
      })
    }
    return summonerProfileData;

  } catch (e) {

    if(e.response.statusCode == '429'){
      console.log('Riot Api is overloaded, wait one minute to refresh');
      throw new Meteor.Error('riot.api ', 'Riot Api is overloaded, wait one minute to refresh');
    }
    else if(e.response.statusCode == 404){
      // user has no ranked stats
      // note: on an update he has already his summonerName. on create, we ensure to pass the summoner name in appropriate function.
      summonerProfileData = {
        'server': server.toUpperCase(),
        'summonerId': summonerId,
        'leagues': []
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
