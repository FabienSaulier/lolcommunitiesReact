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


    this.state = { showModal: false, };

    this._open = this._open.bind(this)
    this._close = this._close.bind(this)
    this.changeModal = this.changeModal.bind(this);

    console.log("constructor com header container with props: ");
    console.log(props);

  }

  joinCommunity (){
   joinCommunity.call({
     _id: this.community._id,
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


 componentWillMount(){
   console.log("componentWillMount");
 }
 componentDidMount(){
   console.log("componentDidMount");
 }
 componentWillUpdate(){
   console.log("componentWillUpdate");
 }
 componentDidUpdate(){
   console.log("componentDidUpdate");
}

_open(){
   this.setState({ showLoginModal: true });
 }
 _close(){
   console.log("close");
   this.setState({ showLoginModal: false });
 }


changeModal(){
  console.log("changeModal");
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
          // <Modal show={this.state.showLoginModal} onHide={this._close} >
          //     <Modal.Body>
          //       <Login />
          //     </Modal.Body>
          //     <Modal.Footer>
          //     <p>Dont have an account? <Button onClick={this.changeModal} >Sign Up</Button>.</p>
          //         <Button onClick={this._close}>Close</Button>
          //     </Modal.Footer>
          // </Modal>
        </div>
      )
    }
  }

   displayActionBtn(community){
    let actionBtn = this.determineActionBtn();
    if( actionBtn === "join")
      return <JoinCommunityBtn joinCommunity={community.handleJoinCommunity} name={community.name} />
    else if(actionBtn === "youarein")
      return <YouAreInBtn />
    else
      return <LoginBtn name={community.name} openModal={this._open} />
  }

  determineActionBtn(){
    //if(Meteor.user() && !Meteor.user().profile.community_id && !Meteor.user().profile.community_id.includes(this.props.community._id))
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
console.log("composer");
console.log(props);
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
