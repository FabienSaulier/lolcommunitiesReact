import React from 'react';
import CommunityHeaderContainer from '../containers/community-header-container';
import CommunityUsersContainer from '../containers/community-users-container';
import CommunityHeaderDataContainer from '../containers/community-header-container';
import { Communities } from '../../api/communities/communities.js';
import { Meteor } from 'meteor/meteor';


 export class Community extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div>
        <CommunityHeaderDataContainer communityName={this.props.params.communityName} />
      </div>
    )
  }

};
