import { LolProfile } from './lolProfile';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';

const riotApiKey = Meteor.settings.public.riotApiKey;


export const insertLolProfileData = (league, stat) =>{

  let lolProfileData = {
    'server' : 'EUW',
    'summonerId': stat.playerOrTeamId,
    'summonerName': stat.playerOrTeamName,
    'queue':league.queue,
    'tier':league.tier,
    'leagueName':league.name,
    'division': stat.division,
    'leaguePoints': stat.leaguePoints,
    'wins':stat.wins,
    'losses':stat.losses
  }

  LolProfile.insert(lolProfileData);


}

export const getSummonerLeague = new ValidatedMethod({
  name: 'getSummonerLeague',
  validate: null,
  run({server, summonerId}) {
    console.log("run getSummonerLeague");
    server = server.toLowerCase();

    try {
      var result = HTTP.call("GET", "https://euw.api.pvp.net/api/lol/"+server+"/v2.5/league/by-summoner/"+summonerId+"/entry?api_key="+riotApiKey,

      function (error, result) {
        if(error){
          throw new Meteor.Error('An error occured',  error);
        } else{

          const league = result.data[summonerId][0];
          const stat = league.entries[0];
          console.log(stat);
          insertLolProfileData(league, stat);

        }
            }
          );
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
    }
  },
});
