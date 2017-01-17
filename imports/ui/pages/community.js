import React from 'react';
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
        <div>
          <CommunityHeaderDataContainer communityName={this.props.params.communityName} />
        </div>
        <div>
          <CommunityUsersContainer communityName={this.props.params.communityName} />
        </div>
      </div>

    )
  }

};
