import React from 'react';
import CommunityContainer from '../containers/community-container';
import CommunityPlayersContainer from '../containers/community-players-container';



export const Community = ( { params, location } ) => (
  <div>
  <h3>Howdy, You lik. {params.communityId} and </h3>
  <CommunityContainer communityId={params.communityId} />
  <CommunityPlayersContainer />
  </div>
);
