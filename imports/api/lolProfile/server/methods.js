import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';

const riotApiKey = Meteor.settings.riotApiKey;

export const createSummonerProfile = (user) => {
  const summonerProfileData = getSummonerProfileData(user.profile.server, user.profile.summonerId);
  LolProfile.insert(summonerProfileData);
}

export const updateSummonerProfile = (user) =>{
  const summonerProfileData = getSummonerProfileData(user.profile.server, user.profile.summonerId);
  LolProfile.update({summonerId: user.profile.summonerId}, summonerProfileData, {validate: false});
}

const getSummonerProfileData = (server, summonerId) => {
  server = server.toLowerCase();
  const riotApiUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v2.5/league/by-summoner/"+summonerId+"/entry?api_key="+riotApiKey;
  try {
    var result = HTTP.call("GET", riotApiUrl);

    let league = result.data[summonerId][0];
    let stats = league.entries[0];
    const summonerProfileData = {
      'server': 'EUW',
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

    console.log(summonerProfileData)
    return summonerProfileData;

  } catch (e) {
    // Got a network error, time-out or HTTP error in the 400 or 500 range.
    console.log(e);
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
