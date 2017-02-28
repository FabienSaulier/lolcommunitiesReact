import { SimpleSchema } from 'meteor/aldeed:simple-schema';

ChampionMasterySchema = new SimpleSchema({
  championId: {
    type:Number,
    label:"championId"
  },
  championPoints:{
    type:Number,
    label:"championPoints"
  },
  championLevel:{
    type:Number,
    label:"championLevel"
  },
  tokensEarned:{
    type:Number,
    label:"tokensEarned"
  }
});
