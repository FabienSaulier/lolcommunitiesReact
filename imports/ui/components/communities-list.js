import React from 'react';
import { List} from 'semantic-ui-react'
import { CommunitySticker } from './community-sticker.js';
import MediaQuery from 'react-responsive';

export class CommunitiesList extends React.Component {

  render(){
    let communities = this.props.data.communities;

    return(

        <div>
  <MediaQuery minDeviceWidth={480}>

      <List >
        {communities.map((com) => (
          <List.Item key={ com._id }><CommunitySticker  community={ com } /></List.Item>

        ))}
      </List>

  </MediaQuery>

</div>

    );
  }

}

CommunitiesList.propTypes = {
  communities: React.PropTypes.array,
};
