import { Communities } from './communities';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';

export const joinCommunity = new ValidatedMethod({
  name: 'community.join',
  validate: null,
  run({_id, userId }) {
    console.log(_id, userId);
    Communities.update(_id, { $push: {user_id: userId} });
    Meteor.users.update(userId, {$push: {'profile.community_id': _id} });

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
