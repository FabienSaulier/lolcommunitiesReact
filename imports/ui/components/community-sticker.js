import React from 'react';
import { Link } from 'react-router'

export const CommunitySticker = ({ community }) => (
  <Link to={"/community/"+community.name} className='ui image big label'>
    <img src={"/communities_logo/"+community.picture} />
    {community.displayName}
  </Link>
);
