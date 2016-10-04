import React from 'react';
import CommunityContainer from '../containers/community-container';



export const Community = ( { params, location } ) => (
  <div>
  <h3>Howdy, You lik. {params.communityId} and </h3>
  <CommunityContainer communityId={params.communityId} />
  </div>
);
