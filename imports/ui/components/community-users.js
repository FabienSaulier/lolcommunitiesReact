import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';


export const CommunityUsers = ({ summoners }) => (

  summoners.length > 0 ? <ListGroup className="communityUsersList">
    {summoners.map((summoner, index) => (
      <div key={index}> {summoner.summonerName}</div>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No summoners yet.</Alert>
);

CommunityUsers.propTypes = {
  users: React.PropTypes.array,
};
