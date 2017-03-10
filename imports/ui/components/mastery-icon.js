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
        <img src={this.getMasteryIconSrc()} alt={"Mastery "+this.props.mastery}  title={"Mastery "+this.props.mastery}  height="50" width="50" />
      :
        <span></span>
    )
  }
}
