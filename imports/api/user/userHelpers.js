import { Meteor } from 'meteor/meteor';

export const Users = Meteor.users;

Users.helpers({

  communities: function() {
    //  console.log(this.profile.communityId);
     // console.log(Communities.find({_id :  { $in: this.profile.communityId}}));

    return Communities.find({_id :  { $in: this.profile.community_Id}});
  },

  // if the current user has the community as his.
  isInCommunity(idCommunity){
    const com = this.profile.community_id;
    console.log("isInCommunity", com, idCommunity);
    if(com && com.includes(idCommunity)){
      console.log("il y a des com et il est dedans");
      return true;

    } else{
      console.log("il n'a pas de com ou n'est pas dans celle là.");
      return false;
    }
  }

});
