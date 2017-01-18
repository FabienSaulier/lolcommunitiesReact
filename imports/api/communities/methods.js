import { Communities } from './communities';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
import {getSummonerLeague} from '../lolProfile/methods';

export const joinCommunity = new ValidatedMethod({
  name: 'community.join',
  validate: null,
  run({_id, userId }) {
    console.log(_id, userId);
    Communities.update(_id, { $push: {user_id: userId} });
    Meteor.users.update(userId, {$push: {'profile.community_id': _id} });

    getSummonerLeague.call({server:'euw', summonerId:'53929665'},
     (error) => {
console.log("join test error", error);
     });


  },
});


export const leaveCommunity = new ValidatedMethod({
  name: 'community.leave',
  validate: null,
  run({_id, userId }) {
    console.log("leave community: ",_id, userId);
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
