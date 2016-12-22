import React from 'react';
import CommunityHeaderContainer from '../containers/community-header-container';
import CommunityUsersContainer from '../containers/community-users-container';

import { Communities } from '../../api/communities/communities.js';
import { Meteor } from 'meteor/meteor';


 export class Community extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.params.communityName);



  }



  componentDidMount(){

        const subscription = Meteor.subscribe('communities');

        if (subscription.ready()){
          console.log("sub ready");
          community = Communities.findOne({name:"HFR"});
          console.log(community);
        }
}

  render() {
    return (
      <div>
        <CommunityHeaderContainer communityName={this.props.params.communityName} />
        <CommunityUsersContainer communityName={this.props.params.communityName}  />
      </div>
    )
  }

};
