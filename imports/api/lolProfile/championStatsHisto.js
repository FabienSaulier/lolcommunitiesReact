import { SimpleSchema } from 'meteor/aldeed:simple-schema';

ChampionStatsHistoSchema = new SimpleSchema({
  lastUpdate:{ // only used for Histo.
    type: String, // easier use to compare on day date: store YYYY-MM-DD
    label: 'lastUpdate'
  },
  championId: {
    type:Number,
    label:"championId"
  },
  championMasteryPoints:{
    type:Number,
    label:"championMasteryPoints"
  },
  championMasteryLevel:{
    type:Number,
    label:"championMasteryLevel"
  },
  tokensEarned:{
    type:Number,
    label:"tokensEarned"
  },
  totalSessionsPlayed:{
    type:Number,
    label:"totalSessionsPlayed"
  },
  totalSessionsLost:{
    type:Number,
    label:"totalSessionsLost"
  },
  totalSessionsWon:{
    type:Number,
    label:"totalSessionsWon"
  },
  totalChampionKills:{
    type:Number,
    label:"totalChampionKills"
  },
  totalAssists:{
    type:Number,
    label:"totalAssists"
  },
  totalDeathsPerSession:{
    type:Number,
    label:"totalDeathsPerSession"
  },
  totalFirstBlood:{
    type:Number,
    label:"totalFirstBlood"
  },
  totalDoubleKills:{
    type:Number,
    label:"totalDoubleKills"
  },
  totalTripleKills:{
    type:Number,
    label:"totalTripleKills"
  },
  totalQuadraKills:{
    type:Number,
    label:"totalQuadraKills"
  },
  totalFirstBlood:{
    type:Number,
    label:"totalFirstBlood"
  },
  lastUpdate:{ // only used for Histo.
    type: String, // easier use to compare on day date: store YYYY-MM-DD
    label: 'lastUpdate'
  }
});
