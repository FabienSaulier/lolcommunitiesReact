import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { joinCommunity } from '../../api/communities/methods.js';
//import { CommunityHeader } from '../components/community-header.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Row, Col, ListGroupItem, Modal, FormControl, Button, Label } from 'react-bootstrap';
import { Signup } from '../pages/signup';
import { Login } from '../pages/login';




import { createContainer } from 'meteor/react-meteor-data';


class CommunityHeaderContainer extends React.Component {

  constructor(props){
    super(props);


    this.state = { showModal: false, };

    this._open = this._open.bind(this)
    this._close = this._close.bind(this)
    this.changeModal = this.changeModal.bind(this);
    this.test = this.test.bind(this);

    console.log("constructor com header container with props: ");
    console.log(props);

    /*
    this.subscription = Meteor.subscribe('communities');
    this.state = {
      community: {},
      actionBtn: "",
      communityName : props.communityName
    };
    */
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

 test(){
   alert("this is the test");
 }

changeModal(){
  console.log("changeModal");
}
  render(){
    console.log("render data: ");
    console.log(this.props);

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
          <Modal show={this.state.showLoginModal} onHide={this._close} >
              <Modal.Body>
                <Login test={this.test} />
              </Modal.Body>
              <Modal.Footer>
              <p>Dont have an account? <Button onClick={this.changeModal} >Sign Up</Button>.</p>
                  <Button onClick={this._close}>Close</Button>
              </Modal.Footer>
          </Modal>

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
    if(Meteor.user() &&  !Meteor.user().profile.community_id.includes(this.props.community._id))
      return "join";
    else if (Meteor.user() &&  Meteor.user().profile.community_id.includes(this.props.community._id))
      return"youarein";
    else
      return"signup";
  }


}

function composer(props, onData) {
  const subscription = Meteor.subscribe('communities');
console.log("composer");
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

  <Button onClick={props.openModal}   className="ui primary button">
    You need to login in order to join {props.name}
  </Button>
);

const YouAreInBtn = () => (
  <Label bsStyle="info">
    You are part of this community
  </Label>
);
