import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';
import moment from 'moment-timezone';

const riotApiKey = Meteor.settings.riotApiKey;


export const createOrUpdateSummonerProfile = (user) => {
  let summonerProfileData = getSummonerProfileData(user);
  summonerProfileData.summonerName = user.profile.summonerName; // ensure the summonerName cause we can't retrieve it from riot if user has no ranked stats.
  let sumProfileDataMerged = mergeHisto(summonerProfileData);

  const ret = LolProfile.update({summonerId: user.profile.summonerId},
                            {$set: {
                              summonerName : sumProfileDataMerged.summonerName,
                              summonerId: user.profile.summonerId,
                              server: user.profile.server,
                              leagues: sumProfileDataMerged.leagues,
                              championsStats: sumProfileDataMerged.championStats
                            }}, { upsert:true, validate: false});
}

export const createOrUpdateSummonerProfileWithChampion = (user, championId) => {
  let summonerProfileData = getSummonerProfileData(user);
  summonerProfileData.summonerName = user.profile.summonerName; // ensure the summonerName cause we can't retrieve it from riot if user has no ranked stats.

  let championStatsData = getSummonerChampionStatsData(user, championId);
  let championMasteryData = getSummonerChampionMasteryData(user, championId);

  Object.assign(championStatsData, championMasteryData);
console.log(championStatsData);

  let sumProfileDataMerged = mergeHisto(summonerProfileData);

console.log(sumProfileDataMerged.leagues);
console.log(championStatsData);

  const ret = LolProfile.update({summonerId: user.profile.summonerId},
                            {$set: {
                              summonerName : sumProfileDataMerged.summonerName,
                              leagues: sumProfileDataMerged.leagues,
                              championsStats: [championStatsData]
                            }}, { upsert:true, validate: false});
                            console.log(ret);
}

// Put the new data in the league historic.
const mergeHisto = (newProfileData) => {

  lolProfile = LolProfile.findOne({summonerId: newProfileData.summonerId});

  if(lolProfile == null) // this is a lolProfile creation
    return newProfileData;

  for(newDataleague of newProfileData.leagues){
    for(league of lolProfile.leagues){
      if(newDataleague.queue == league.queue){
        // put the histo into the empty new data from riot.
        newDataleague.histo = league.histo;

        const lastHistoEntry = league.histo[league.histo.length-1];
        const currentDay = moment().tz("Europe/London").format("YYYY-MM-DD"); // GMT
        const todayHisto = {
          'date': currentDay,
          'tier': newDataleague.tier,
          'division': newDataleague.division,
          'leaguePoints': newDataleague.leaguePoints
        };

        if(!lastHistoEntry)
            newDataleague.histo.push(todayHisto);
        else if(lastHistoEntry.date != currentDay)
          newDataleague.histo.push(todayHisto);
        else if (lastHistoEntry.date == currentDay)
          newDataleague.histo[league.histo.length-1] = todayHisto;
      }
    }
  }
  return newProfileData;
}

export const refreshSummonerProfile = new ValidatedMethod({
  name: 'summonerProfile.refresh',
  validate:null,
  run({lolProfile}) {
    const user = { profile: {
                      summonerId:lolProfile.summonerId,
                      summonerName: lolProfile.summonerName,
                      server: lolProfile.server
                    }};
    createOrUpdateSummonerProfile(user);
  }
});

export const refreshChampionStatsSummonerProfile = new ValidatedMethod({
  name: 'summonerProfile.refreshChampionStats',
  validate:null,
  run({lolProfile, championId}) {
    const user = { profile: {
                      summonerId:lolProfile.summonerId,
                      summonerName: lolProfile.summonerName,
                      server: lolProfile.server
                    }};
    createOrUpdateSummonerProfileWithChampion(user, championId);
  }
});

const getSummonerProfileData = (user) => {
  const server = user.profile.server;
  const summonerId = user.profile.summonerId;
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
      'leagues':[],
      'championsStats':[]
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
        'losses': stats.losses,
        'histo':[{
          'date': moment().tz("Europe/London").format("YYYY-MM-DD"), // GMT
          'tier': league.tier,
          'division': stats.division,
          'leaguePoints': stats.leaguePoints
        }]
      })
    }
    return summonerProfileData;

  } catch (e) {
    if(e.response && e.response.statusCode == '429'){
      console.log('Riot Api is overloaded, wait one minute to refresh');
      throw new Meteor.Error('riot.api ', 'Riot Api is overloaded, wait one minute to refresh');
    }
    else if(e.response && e.response.statusCode == 404){
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

const getSummonerChampionMasteryData = (user, championId) => {
  const server = user.profile.server;
  const summonerId = user.profile.summonerId;
  /** https://developer.riotgames.com/docs/regional-endpoints **/
  let platformId;
  if(server.toLowerCase == 'kr' || server.toLowerCase == 'ru')
    platformId = server;
  else if(server.toLowerCase == 'las')
    platformId = server+"2";
  else
    platformId = server+"1";

  const riotApiChampionMasteryUrl =  "https://"+server+".api.pvp.net/championmastery/location/"+platformId+"/player/"+summonerId+"/champion/"+championId+"?api_key="+riotApiKey;
  try {
    var result = HTTP.call("GET", riotApiChampionMasteryUrl);

    let championData = {
      'championId': result.data.championId,
      'championLevel': result.data.championLevel,
      'championPoints': result.data.championPoints,
      'tokensEarned': result.data.tokensEarned
    }
    return championData;

  } catch (e) {

    if(e.response.statusCode == '429'){
      console.log('Riot Api is overloaded, wait one minute to refresh');
      throw new Meteor.Error('riot.api ', 'Riot Api is overloaded, wait one minute to refresh');
    }
    else if(e.response.statusCode == 204){ // no content for the championid
      let championData = {
        'championId': championId,
        'championLevel': 0,
        'championPoints': 0,
        'tokensEarned': 0
      }
      return championData;
    } else{
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log('at: '+riotApiChampionMasteryUrl);
      console.log(e);
      throw new Meteor.Error('riot.api ', 'Unknown error from Riot api.');
    }
  }
}


const getSummonerChampionStatsData = (user, championId) => {
  const server = user.profile.server;
  const summonerId = user.profile.summonerId;
  const riotApiChampionStatsUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v1.3/stats/by-summoner/"+summonerId+"/ranked?season=SEASON2017&api_key="+riotApiKey;
  try {
    var result = HTTP.call("GET", riotApiChampionStatsUrl);

    for(champion of result.data.champions){
      if(champion.id == championId){
        return champion.stats;
      }
    }
  } catch (e) {

    if(e.response.statusCode == '429'){
      console.log('Riot Api is overloaded, wait one minute to refresh');
      throw new Meteor.Error('riot.api ', 'Riot Api is overloaded, wait one minute to refresh');
    }
    else if(e.response.statusCode == 404){
      // user has no ranked stats
      // note: on an update he has already his summonerName. on create, we ensure to pass the summoner name in appropriate function..
      console.log('at '+riotApiChampionStatsUrl);
      console.log('id champion undetermined? ':championId);
    } else{
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log('at: '+riotApiChampionStatsUrl);
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
