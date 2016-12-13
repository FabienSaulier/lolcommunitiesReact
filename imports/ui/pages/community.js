import React from 'react';
import CommunityHeaderContainer from '../containers/community-header-container';
import CommunityUsersContainer from '../containers/community-users-container';



export const Community = ( { params, location } ) => (
  <div>
    <CommunityHeaderContainer communityName={params.communityName} />
    <CommunityUsersContainer communityName={params.communityName}  />
  </div>
);
