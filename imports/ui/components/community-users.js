import React from 'react';
import CommunityUsersGeneral from './community-users-general';
import CommunityUsersChampionFocus from './community-users-champion-focus';

export class CommunityUsers extends React.Component {

  constructor(props){
    super(props);
   };

  render(){
    return(
      this.props.community.championFocus != null ?
        <CommunityUsersChampionFocus community={this.props.community} summoners={this.props.summoners} />
      :
        <CommunityUsersGeneral community={this.props.community} summoners={this.props.summoners} />
    )
  }
}
