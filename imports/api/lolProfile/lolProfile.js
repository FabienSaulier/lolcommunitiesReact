import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const LolProfile = new Mongo.Collection('LolProfile');

//TODO rename en lolInformation, summonerInformation, summonerData, summonerProfil
/*
ile.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
*/

LolProfile.schema = new SimpleSchema({
  server:{
    type:String,
    label:"server",
    allowedValues: ['NA', 'EUW', 'LAN','EUNE', 'BR', 'TR', 'RU', 'LAS', 'OCE', 'KR', 'JP'],
  },
  summonerId: {
    type: String,
    label: "summonerId",
    max: 100
  },
  summonerName: {
    type: String,
    label: "summonerName",
    max: 100
  },
  queue: {
    type:String,
    label:"queue",
    allowedValues: ['RANKED_FLEX_SR', 'RANKED_FLEX_TT', 'RANKED_SOLO_5x5', 'RANKED_TEAM_3x3', 'RANKED_TEAM_5x5']
  },
  tier: {
    type: String,
    label: "tier",
    allowedValues: ['CHALLENGER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE']
  },
  division: {
    type:String,
    label: 'division',
    allowedValues: ['I', 'II', 'III', 'IV', 'V']
  },
  wins: {
    type: Number,
    label: "wins"
  },
  leaguePoints: {
    type: Number,
    label: "leaguePoints"
  },
  leagueName: {
    type: String,
    label: "leagueName"
  },
  losses: {
    type: Number,
    label: "losses"
  }
});

LolProfile.attachSchema(LolProfile.schema);
