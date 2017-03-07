import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {ChampionStatsHistoValueSchema} from './championStatsHisto';

export const ChampionStatsSchema = new SimpleSchema({
  championId: {
    type:Number,
    label:"championId"
  },
  histo:{
    type: [ChampionStatsHistoValueSchema],
    label: "historicChampionValue"
  },
  date:{
      type:String,
      label: "last update"
  },
  /** Champion Mastery  **/
  championPoints:{
    type:String,
    label:"championPoints"
  },
  championLevel:{
    type:Number,
    label:"championLevel"
  },
  tokensEarned:{
    type:Number,
    label:"tokensEarned"
  },

  /** ChampionStats  **/
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
  totalPentaKills:{
    type:Number,
    label:"totalPentaKills"
  }
});
