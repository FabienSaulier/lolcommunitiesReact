import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Row, Col, ListGroupItem, Modal, FormControl, FormGroup, ControlLabel, Button, Label } from 'react-bootstrap';
import { Login } from '../pages/login';
import {Link } from 'react-router';

import {Users} from '../../api/user/userHelpers';

import { LinkContainer } from 'react-router-bootstrap';


class CommunityHeaderContainer extends React.Component {

  constructor(props){
    super(props);
    this.joinCommunity = this.joinCommunity.bind(this);
    this.leaveCommunity = this.leaveCommunity.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.userCommunityNameHandleChange = this.userCommunityNameHandleChange.bind(this);
    this.state = {showModal: false, userCommunityNameValue: ''};

  }

  leaveCommunity (){
    Meteor.call( 'community.leave', {_id: this.props.community._id,
      userId: Meteor.userId()}, (error) => {
      if (error) {
         Bert.alert(error.reason, 'danger');
       } else {
         Bert.alert('leave the community!', 'success');
       }
     });
  }

  joinCommunity() {
    Meteor.call('community.join', {
      userCommunityName: this.state.userCommunityNameValue,
      community: this.props.community,
      user: Meteor.user()
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.closeModal();
        Bert.alert('Join the community!', 'success');
      }
    });
  }

   openModal(){
     this.setState({ showModal: true });
   }
   closeModal(){
     this.setState({showModal: false});
   }
   userCommunityNameHandleChange(e){
     this.setState({userCommunityNameValue: e.target.value});
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
          <Modal show={this.state.showModal} onHide={this.closeModal} >
            <Modal.Header >
              <Modal.Title>What name do you use in {this.props.community.name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <FormControl
                  type="text"
                  ref="userCommunityName"
                  name="userCommunityName"
                  value={this.state.userCommunityNameValue}
                  onChange={this.userCommunityNameHandleChange}
                  placeholder={"name used in "+this.props.community.name}
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.joinCommunity}>Join</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    }
  }

   displayActionBtn(community){
    let actionBtn = this.determineActionBtn();
    if( actionBtn === "join")
      return <JoinCommunityBtn joinCommunity={this.openModal} name={community.name} />

    //  return <JoinCommunityBtn joinCommunity={this.joinCommunity} name={community.name} />
    else if(actionBtn === "youarein")
      return <YouAreInBtn leaveCommunity={this.leaveCommunity} name={community.name}  />
    else
      return <LoginBtn name={community.name} />
  }

  determineActionBtn(){
    if(Meteor.user() && !Meteor.user().isInCommunity(this.props.community._id))
      return "join";
    else if (Meteor.user() &&  Meteor.user().isInCommunity(this.props.community._id))
      return"youarein";
    else
      return "login";
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
/*
const JoinCommunityBtn = (props) => (
  <Button onClick={props.joinCommunity} className="ui primary button">
    Join {props.name}
  </Button>
);
*/

const LoginBtn = (props) => (
  <Link to={'/communityjoin/'+props.name}>You need to login in order to join {props.name}</Link>
);

const YouAreInBtn = (props) => (
  <span>
    <Label bsStyle="info">
      You are part of this community
    </Label>
    <Button onClick={props.leaveCommunity} className="ui primary button">
      leave {props.name}
    </Button>
  </span>
);
