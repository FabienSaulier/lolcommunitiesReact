import React from 'react';

export class TierIconImage extends React.Component {


  constructor(props){
    super(props);
    this.getTierIconSrc = this.getTierIconSrc.bind(this);
  }

   getTierIconSrc(){
    return '/icons/'+this.props.tier.toLowerCase()+'.png';
  }

  render(){
    return(
      <img src={this.getTierIconSrc()}   height="32" width="32" />
    )
  }
}
