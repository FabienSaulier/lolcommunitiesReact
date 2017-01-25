import { Communities } from '../communities';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
import {createSummonerProfile, updateSummonerProfile} from '../../lolProfile/server/methods';

export const joinCommunity = new ValidatedMethod({
  name: 'community.join',
  validate: null,
  run({community, user, userCommunityName }) {
    // insert the user in the community
    Communities.update(community._id, { $push: {user_id: user._id} });
    Meteor.users.update(user._id, {$push: {'profile.community_id': community._id} });

    const hasProfile = Meteor.call('LolProfile.hasUserLolProfile', {user : user });

    if(hasProfile){
      console.log("todo update profile");
      updateSummonerProfile(user);
    } else{
      console.log("todo insert profile");
      createSummonerProfile(user, userCommunityName);
    }
  },
});

const riotApiKey = Meteor.settings.riotApiKey;

// check if summoner exist and return riot Id.
export const checkSummonerExist = new ValidatedMethod({
  name: 'User.checkSummonerExist',
  validate: new SimpleSchema({
    server: { type: String },
    summonerName: { type: String },
  }).validator(),
  run({ server, summonerName }) {
    server = server.toLowerCase();
    const riotApiUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v1.4/summoner/by-name/"+summonerName+"?api_key="+riotApiKey;
    try {
      var result = HTTP.call("GET", riotApiUrl);

      console.log(result.data[summonerName.toLowerCase()]);

      return result.data[summonerName.toLowerCase()].id;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
    }

  },
});



export const leaveCommunity = new ValidatedMethod({
  name: 'community.leave',
  validate: null,
  run({_id, userId }) {
    console.log("leave com method server");
    Communities.update(_id, { $pull: {user_id: userId} });
    Meteor.users.update(userId, {$pull: {'profile.community_id': _id} });
  },
});

export const insertCommunity = new ValidatedMethod({
  name: 'communities.insert',
  validate: new SimpleSchema({
    name: { type: String },
    url: { type: String , optional:true},
  }).validator(),
  run(community) {
    Communities.insert(community);
  },
});

export const updateCommunity = new ValidatedMethod({
  name: 'communities.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.name': { type: String, optional: false },
    'update.url': { type: String, optional: true },

  }).validator(),
  run({ _id, update }) {
    Communities.update(_id, { $set: update });
  },
});

export const removeCommunity = new ValidatedMethod({
  name: 'communities.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Communities.remove(_id);
  },
});
