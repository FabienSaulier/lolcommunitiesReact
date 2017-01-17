import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { joinCommunity } from '../../api/communities/methods.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Row, Col, ListGroupItem, Modal, FormControl, Button, Label } from 'react-bootstrap';
import { Login } from '../pages/login';
import {Link } from 'react-router';

import {Users} from '../../api/user/userHelpers';

import { LinkContainer } from 'react-router-bootstrap';


class CommunityHeaderContainer extends React.Component {

  constructor(props){
    super(props);
    this._open = this._open.bind(this)
    this._close = this._close.bind(this)
    this.changeModal = this.changeModal.bind(this);
    this.joinCommunity = this.joinCommunity.bind(this);
  }

  joinCommunity (){
    console.log("join community");
    joinCommunity.call({
      _id: this.props.community._id,
      userId: Meteor.userId(),
    }, (error) => {
      if (error) {
         //TODO gérer le cas où l'user est déjà dedans (mettre un unique dans le model?)
         Bert.alert(error.reason, 'danger');
       } else {
         Bert.alert('Join the community!', 'success');
       }
     });
   }

  render(){
    if(this.props.ready === false){
      return(
        <Loading />
      )
    }
    else {
      return(
        <div>
          <div className='ui image'>
            <img src={"/communities_logo/"+this.props.community.picture} />
          </div>
          <a className="ui big label" href={this.props.community.url} target="_blank" >{this.props.community.name}</a>
          {this.displayActionBtn( this.props.community)}
        </div>
      )
    }
  }

   displayActionBtn(community){
    let actionBtn = this.determineActionBtn();
    if( actionBtn === "join")
      return <JoinCommunityBtn joinCommunity={this.joinCommunity} name={community.name} />
    else if(actionBtn === "youarein")
      return <YouAreInBtn />
    else
      return <LoginBtn name={community.name} openModal={this._open} />
  }

  determineActionBtn(){
    if(Meteor.user() && !Meteor.user().isInCommunity(this.props.community._id))
      return "join";
    else if (Meteor.user() &&  Meteor.user().isInCommunity(this.props.community._id))
      return"youarein";
    else
      return "join";
  }

}

function composer(props, onData) {
  const subscription = Meteor.subscribe('communities');
  if (subscription.ready()) {
    const data = {
      ready: true,
      community:  Communities.findOne({name:props.communityName})
    }
    onData(null, data);
  } else {
    onData(null, {ready: false});
  }
}

export default CommunityHeaderDataContainer = composeWithTracker(composer)(CommunityHeaderContainer);


const JoinCommunityBtn = (props) => (
  <Button onClick={props.joinCommunity} className="ui primary button">
    Join {props.name}
  </Button>
);

const LoginBtn = (props) => (
  <Link to={'/communityjoin/'+props.name}>You need to login in order to join {props.name}</Link>
);

const YouAreInBtn = () => (
  <Label bsStyle="info">
    You are part of this community
  </Label>
);
