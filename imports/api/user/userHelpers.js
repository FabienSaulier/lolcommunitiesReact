import { Meteor } from 'meteor/meteor';

export const Users = Meteor.users;

Users.helpers({

  communities: function() {
    return Communities.find({_id :  { $in: this.profile.community_Id}});
  },

  // if the current user has the community as his.
  isInCommunity(idCommunity){
    const com = this.profile.community_id;
    if(com && com.includes(idCommunity)){
      return true;
    } else{
      return false;
    }
  }

});
