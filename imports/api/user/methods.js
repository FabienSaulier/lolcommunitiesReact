import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { HTTP } from 'meteor/http';


const riotApiKey = Meteor.settings.riotApiKey;


/*
export const checkCallBack = (error, res) => {
if(error){
  throw new Meteor.Error('Error', 'We didn\'t found your lol account');

}
console.log(res);

}
*/

export const checkSummonerExist = new ValidatedMethod({
  name: 'User.methods.checkSummonerExist',
  validate: new SimpleSchema({
    server: { type: String },
    summonerName: { type: String },
  }).validator(),

  run({ server, summonerName }) {
    console.log("dans le run de la methode server");


    server = server.toLowerCase();
    /*
  const res =   HTTP.get("https://euw.api.pvp.net/api/lol/"+server+"/v1.4/summoner/by-name/"+summonerName+"?api_key="+riotApiKey,
            {}, checkCallBack);
*/
try{
  var convertAsyncToSync  = Meteor.wrapAsync( HTTP.get ),
  resultOfAsyncToSync = convertAsyncToSync("https://euw.api.pvp.net/api/lol/"+server+"/v1.4/summoner/by-name/"+summonerName+"?api_key="+riotApiKey, {} );
  console.log(resultOfAsyncToSync);

} catch(e){
  console.log(e);
}


  return resultOfAsyncToSync;
  },
});
