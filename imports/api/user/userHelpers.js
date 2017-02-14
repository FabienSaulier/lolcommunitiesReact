import { Meteor } from 'meteor/meteor';

export const Users = Meteor.users;

Users.helpers({

  communities: function() {
    return Communities.find({_id :  { $in: this.profile.community_Id}});
  },

  // if the current user has the community as his.
  isInCommunity(idCommunity){
    return this.profile.communities.some(function(community){
      if(community._id == idCommunity)
        return true;
    });
  }

});
