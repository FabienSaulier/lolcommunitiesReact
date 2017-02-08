import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Row, Col, ListGroupItem, Modal, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import { Login } from '../pages/login';
import {Link } from 'react-router';
import { Header, Image, Button, Label} from 'semantic-ui-react'

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
    if(!this.state.userCommunityNameValue)
      return;

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
          <Header as='h3'>
            <Image src={"/communities_logo/"+this.props.community.picture} />
              <Header.Content>
                <Button  size="big" href={this.props.community.url} target="_blank" >{this.props.community.name}</Button>

                  {this.displayActionBtn( this.props.community)}

              </Header.Content>
          </Header>
          <Modal show={this.state.showModal} onHide={this.closeModal} onEnter={this.joinCommunity} >
            <Modal.Header >
              <Modal.Title>What name do you use at {this.props.community.name}?</Modal.Title>
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
              <Button primary onClick={this.joinCommunity}>Join</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    }
  }

   displayActionBtn(community){
    let actionBtn = this.determineActionBtn();
    if( actionBtn === "join")
      return <JoinCommunityBtn  joinCommunity={this.openModal} name={community.name} />
    else if(actionBtn === "youarein")
      return null;//<YouAreInBtn leaveCommunity={this.leaveCommunity} name={community.name}  />
    else
      return <LoginBtn  name={community.name} />
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
  <Button primary onClick={props.joinCommunity} >
    Join
  </Button>
);

const LoginBtn = (props) => (
  <Link to={'/communityjoin/'+props.name}>Log in to join</Link>
);

const YouAreInBtn = (props) => (
  <span>
    <Label bsStyle="info">
      You are part of this community
    </Label>
    {
      /*
    <Button onClick={props.leaveCommunity} className="ui primary button">
      leave {props.name}
    </Button>
    */
    }
  </span>
);
