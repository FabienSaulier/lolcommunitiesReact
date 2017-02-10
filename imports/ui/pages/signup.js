import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { handleSignup } from '../../modules/signup';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor'

export class Signup extends React.Component {

  constructor(){
    super()
    this.state = {
        summonerName:'',
        server:'',
        summonerId:''
    };
    this.checkSummonerExist = this.checkSummonerExist.bind(this);
    this.checkSummonerExistCallBack = this.checkSummonerExistCallBack.bind(this);
  }

  checkSummonerExistCallBack(error, result){
    if(error){
      Bert.alert(error.reason, 'warning');
    }
    else{
      Bert.alert('Found your lol account!', 'success');
      console.log(result);
      this.setState({summonerId: result});
    }
  }

  componentDidMount() {
    handleSignup({ component: this });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleChange(e){
    if(e.target.name=="server")
      this.setState({[e.target.name]: e.target.value}, function(){
        this.checkSummonerExist();
      }.bind(this) );
    else
      this.setState({[e.target.name]: e.target.value});
  }

  handleOnBlur(e){
    this.checkSummonerExist();
  }

  checkSummonerExist(){
    console.log("ds le server: "+this.state.server);
    if (this.state.summonerName && this.state.server && this.state.server != "") {
      const server = this.state.server;
      const summonerName = this.state.summonerName.trim();
      Meteor.call('User.checkSummonerExist', {
        server: server,
        summonerName: summonerName
      }, this.checkSummonerExistCallBack)
    }
  }

  render() {
    return <Row>
      <Col xs={ 12 } sm={ 6 } md={ 4 }>
        <h4 className="page-header">Sign Up</h4>
        <form ref="signup" className="signup" onSubmit={ this.handleSubmit }>
          <FormGroup>
            <ControlLabel>Summoner Name</ControlLabel>
            <FormControl
              onBlur={this.handleOnBlur.bind(this)}
              onChange={this.handleChange.bind(this)}
              type="text"
              ref="summonerName"
              name="summonerName"
              placeholder="summoner name"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>server</ControlLabel>
            <FormControl
              componentClass="select"
              onChange={this.handleChange.bind(this)}
              type="text"
              ref="server"
              name="server"
              placeholder="server">
              <option value=""></option>
              <option value="EUW">EUW</option>
              <option value="NA">NA</option>
              <option value="LAN">LAN</option>
              <option value="EUNE">EUNE</option>
              <option value="TR">TR</option>
              <option value="LAS">LAS</option>
              <option value="OCE">OCE</option>
              <option value="JP">JP</option>
            </FormControl>
          </FormGroup>
          <input type="hidden" ref="summonerId" value={this.state.summonerId}></input>
          <FormGroup>
            <ControlLabel>Email Address</ControlLabel>
            <FormControl
              type="text"
              ref="emailAddress"
              name="emailAddress"
              placeholder="Email Address"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              ref="password"
              name="password"
              placeholder="Password"
            />
          </FormGroup>
          <Button type="submit" bsStyle="success">Sign Up</Button>
        </form>
        <p>Already have an account? <Link to="/login">Log In</Link>.</p>
      </Col>
    </Row>;
  }
}
