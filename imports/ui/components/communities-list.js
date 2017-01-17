import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { CommunitySticker } from './community-sticker.js';

export class CommunitiesList extends React.Component {

  render(){
    let communities = this.props.data.communities;

    return(
      communities.length > 0 ? <ListGroup className="communities-list">
        {communities.map((com) => (
          <CommunitySticker key={ com._id } community={ com } />
        ))}
      </ListGroup> :
      <Alert bsStyle="warning">No communities yet.</Alert>
    );
  }

}

CommunitiesList.propTypes = {
  communities: React.PropTypes.array,
};
