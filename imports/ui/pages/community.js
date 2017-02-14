import React from 'react';
import CommunityUsersContainer from '../containers/community-users-container';
import CommunityHeaderDataContainer from '../containers/community-header-container';
import { Communities } from '../../api/communities/communities';
import { Meteor } from 'meteor/meteor';

 export class Community extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <CommunityHeaderDataContainer communityName={this.props.params.communityName} />
        </div>
        <br />
        <div>
          <CommunityUsersContainer communityName={this.props.params.communityName} />
        </div>
      </div>
    )
  }
};
