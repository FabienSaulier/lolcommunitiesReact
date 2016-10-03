import React from 'react';

export const CommunityDetail = ({ community }) => (
  <Link to={'/community/123456'} className='ui image big label'>
    <img src={"/communities_logo/"+community.picture} />
    {community.name}
  </Link>
);
