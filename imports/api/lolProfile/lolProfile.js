import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {ChampionMasterySchema} from './championMastery';

export const LolProfile = new Mongo.Collection('LolProfile');

HistoValueSchema = new SimpleSchema({
  date:{
    type: String, // easier use to compare on day date: store YYYY-MM-DD
    label: 'date'
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
  leaguePoints: {
    type: Number,
    label: "leaguePoints"
  }
});

LeagueSchema = new SimpleSchema({
  queue: {
    type:String,
    label:"queue",
    allowedValues: ['RANKED_FLEX_SR', 'RANKED_FLEX_TT', 'RANKED_SOLO_5x5', 'RANKED_TEAM_3x3', 'RANKED_TEAM_5x5', 'UNRANKED']
  },
  tier: {
    type: String,
    label: "tier",
    allowedValues: ['CHALLENGER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'],
    optional: true
  },
  division: {
    type:String,
    label: 'division',
    allowedValues: ['I', 'II', 'III', 'IV', 'V'],
    optional: true
  },
  wins: {
    type: Number,
    label: "wins",
    optional: true
  },
  leaguePoints: {
    type: Number,
    label: "leaguePoints",
    optional: true
  },
  leagueName: {
    type: String,
    label: "leagueName",
    optional: true
  },
  losses: {
    type: Number,
    label: "losses",
    optional: true
  },
  histo:{
    type: [HistoValueSchema]
  }
});

LolProfile.schema = new SimpleSchema({
  server: {
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
  leagues: {
    type: [LeagueSchema]
  },
  championsMasteries: {
    type: [ChampionMasterySchema]
  }
});

LolProfile.attachSchema(LolProfile.schema);
