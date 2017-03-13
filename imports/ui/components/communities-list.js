import React from 'react';
import { List} from 'semantic-ui-react'
import { CommunitySticker } from './community-sticker.js';

export class CommunitiesList extends React.Component {

  render(){
    let communities = this.props.data.communities;
    return(
      <List >
        {communities.map((com) => (
          <List.Item key={ com._id }><CommunitySticker  community={ com } /></List.Item>
        ))}
      </List>
    );
  }
}

CommunitiesList.propTypes = {
  communities: React.PropTypes.array,
};
