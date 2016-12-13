import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';


export const CommunityUsers = ({ users }) => (

  users.length > 0 ? <ListGroup className="communityUsersList">
    {users.map((user, index) => (
      <div key={index}> {user.profile.summonerName}</div>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No users yet.</Alert>
);

CommunityUsers.propTypes = {
  users: React.PropTypes.array,
};
