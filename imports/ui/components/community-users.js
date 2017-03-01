import React from 'react';
import CommunityUsersGeneral from './community-users-general';
import CommunityUsersChampionFocus from './community-users-champion-focus';



export class CommunityUsers extends React.Component {

  constructor(props){
    super(props);


    //TODO  depending on the prop use a sub community-user:   Champion focus. or another.
    console.log(props);


   };

  render(){
  return(
    this.props.community.championFocus != null ?
      <CommunityUsersChampionFocus summoners={this.props.summoners} />
    :
      <CommunityUsersGeneral summoners={this.props.summoners} />


    )
  }
}
