import { Meteor } from 'meteor/meteor';

Meteor.publish('usersData', function (){
  return Meteor.users.find({}, {fields: {profile: 1}});
});
