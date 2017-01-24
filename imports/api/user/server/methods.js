import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { HTTP } from 'meteor/http';


const riotApiKey = Meteor.settings.riotApiKey;


/* wtf meteor trouve pas la methode dans ce fichier ??

export const checkSummonerExist = new ValidatedMethod({
  name: 'checkSummonerExist',
  validate: new SimpleSchema({
    server: { type: String },
    summonerName: { type: String },
  }).validator(),
  run({ server, summonerName }) {
console.log("serv");
    server = server.toLowerCase();

    const riotApiUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v1.4/summoner/by-name/"+summonerName+"/entry?api_key="+riotApiKey;

    try {
      var result = HTTP.call("GET", riotApiUrl);

      console.log(result);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
    }

  },
});
*/
