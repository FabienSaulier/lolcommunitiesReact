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
    this.setState({[e.target.name]: e.target.value});
  }

  handleOnBlur(event){
    if(this.state.summonerName && this.state.server){
      const server = this.state.server;
      const summonerName = this.state.summonerName;



      Meteor.call( 'User.checkSummonerExist',
        {server: server,
        summonerName: summonerName},
this.checkSummonerExistCallBack
        /*
        function (error, result) {
          console.log(error);
          console.log(result); }*/

      //

      );
      /*
        (error) => {
        if (error) {
           //TODO gérer le cas où l'user est déjà dedans (mettre un unique dans le model?)
           Bert.alert(error.reason, 'danger');
         } else {
           Bert.alert('leave the community!', 'success');
         }
       });
*/

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
              onBlur={this.handleOnBlur.bind(this)}
              onChange={this.handleChange.bind(this)}
              type="text"
              ref="server"
              name="server"
              placeholder="server"
            />
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
