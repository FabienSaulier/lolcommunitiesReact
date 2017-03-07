import React from 'react';

export class MasteryIconImage extends React.Component {
  constructor(props){
    super(props);
    this.getMasteryIconSrc = this.getMasteryIconSrc.bind(this);
  }

   getMasteryIconSrc(){
    return '/icons/CM'+this.props.mastery+'.png';
  }

  render(){
    return(
      this.props.mastery ?
        <img src={this.getMasteryIconSrc()}   height="32" width="32" />
      :
        <span></span>
    )
  }
}
