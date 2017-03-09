import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';
import moment from 'moment-timezone';

const riotApiKey = Meteor.settings.riotApiKey;


export const createOrUpdateSummonerProfile = (user) => {
  let summonerProfileData = getSummonerProfileData(user);
  summonerProfileData.summonerName = user.profile.summonerName; // ensure the summonerName cause we can't retrieve it from riot if user has no ranked stats.

  let currentLolProfil = LolProfile.findOne({summonerId: user.profile.summonerId});

  let sumProfileDataMerged = mergeHisto(summonerProfileData, currentLolProfil);

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

  let currentLolProfil = LolProfile.findOne({summonerId: user.profile.summonerId});
  let sumProfileDataMerged = mergeHisto(summonerProfileData,currentLolProfil);
console.log(championStatsData);

  let championStatsDataMerged = mergeChampionDataHisto(championStatsData, currentLolProfil);
  console.log(championStatsDataMerged)

  const ret = LolProfile.update({summonerId: user.profile.summonerId},
                            {$set: {
                              summonerName : sumProfileDataMerged.summonerName,
                              summonerId: user.profile.summonerId,
                              server: user.profile.server,
                              leagues: sumProfileDataMerged.leagues,
                              championsStats: championStatsDataMerged
                            }}, { upsert:true, validate: false});

}

// Put the new data in the league historic (all leagues are concerned)
const mergeHisto = (newProfileData, currentLolProfil) => {
  if(currentLolProfil == null) // this is a lolProfile creation
    return newProfileData;

  for(newDataleague of newProfileData.leagues){
    for(league of currentLolProfil.leagues){
      if(newDataleague.queue == league.queue){
        // put the histo into the empty new data from riot.
        newDataleague.histo = league.histo;

        const lastHistoEntry = league.histo[league.histo.length-1];
        const currentDay = moment().tz("Europe/London").format("YYYY-MM-DD"); // GMT
        const todayHisto = {
          'date': currentDay,
          'tier': newDataleague.tier,
          'division': newDataleague.division,
          'leaguePoints': newDataleague.leaguePoints,
          'wins': newDataleague.wins,
          'losses': newDataleague.losses
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

// New data concerning only one champion
const mergeChampionDataHisto = (newChampionStatsData, currentLolProfil) => {
  // this is a lolProfile creation
  if(currentLolProfil == null || currentLolProfil.championsStats.length == 0){
    // initiate histo
    let copyChampionStats = Object.assign({}, newChampionStatsData);
    copyChampionStats.date = moment().tz("Europe/London").format("YYYY-MM-DD"), // GMT
    newChampionStatsData.histo = [];
    newChampionStatsData.histo.push(copyChampionStats);
    return [newChampionStatsData];
  }

  let newChampionStatsDataWereInserted = false;

  // for each existing champion stats
  currentLolProfil.championsStats = currentLolProfil.championsStats.map(function(cStats) {
    // update and Histo an existing champion stats.
    if(cStats.championId == newChampionStatsData.championId){
      const tmpHisto = cStats.histo.slice();
      const lastHistoEntry = cStats.histo[cStats.histo.length-1];
      const currentDay = moment().tz("Europe/London").format("YYYY-MM-DD"); // GMT
      let todayHisto = Object.assign({},newChampionStatsData);
      todayHisto.date = currentDay;

      // set the old stats with the new values and add the saved histo
      cStats = newChampionStatsData;
      cStats.histo = tmpHisto;

      // add today histo
      if(!lastHistoEntry || lastHistoEntry.date != currentDay)
        cStats.histo.push(todayHisto);
      else if (lastHistoEntry.date == currentDay)
        cStats.histo[cStats.histo.length-1] = todayHisto;

      newChampionStatsDataWereInserted = true;
    }
    return cStats;
  });

  // it's a new champion stat.
  if(!newChampionStatsDataWereInserted){
    // initiate histo
    let copyChampionStats = Object.assign({}, newChampionStatsData);
    copyChampionStats.date = moment().tz("Europe/London").format("YYYY-MM-DD"), // GMT
    newChampionStatsData.histo = [];
    newChampionStatsData.histo.push(copyChampionStats);
    currentLolProfil.championsStats.push(newChampionStatsData);
  }

  return currentLolProfil.championsStats;
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
        'date': moment().tz("Europe/London").format("YYYY-MM-DD"), // GMT
        'histo':[{
          'date': moment().tz("Europe/London").format("YYYY-MM-DD"), // GMT
          'tier': league.tier,
          'division': stats.division,
          'leaguePoints': stats.leaguePoints,
          'wins': stats.wins,
          'losses': stats.losses
        }]
      })
    }
    return summonerProfileData;

  } catch (e) {
    if(!e.response){
      console.log('at: '+riotApiUrl);
      console.log(e);
    }
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
    if(!result.data){
      return {
        'championId': championId,
        'championLevel': 0
      }
    } else {
      return {
       'championId': championId,
       'championLevel': result.data.championLevel,
       'championPoints': result.data.championPoints,
       'tokensEarned': result.data.tokensEarned
     }
    }

  } catch (e) {
    if(!e.response){
      console.log('at: '+riotApiChampionMasteryUrl);
      console.log(e);
    }
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
        champion.stats.date = moment().tz("Europe/London").format("YYYY-MM-DD");
        return champion.stats;
      }
    }
    return { //default case when user has not stats on this champion.
        championId: championId,
        date : moment().tz("Europe/London").format("YYYY-MM-DD")
    };
  } catch (e) {
    if(!e.response){
      console.log('at: '+riotApiChampionStatsUrl);
      console.log(e);
    }
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
