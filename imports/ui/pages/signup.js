import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { handleSignup } from '../../modules/signup';

export class Signup extends React.Component {
  componentDidMount() {
    handleSignup({ component: this });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return <Row>
      <Col xs={ 12 } sm={ 6 } md={ 4 }>
        <h4 className="page-header">Sign Up</h4>
        <form ref="signup" className="signup" onSubmit={ this.handleSubmit }>

          <FormGroup>
            <ControlLabel>Summoner Name</ControlLabel>
            <FormControl
              type="text"
              ref="summonerName"
              name="summonerName"
              placeholder="summoner name"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>summoner id</ControlLabel>
            <FormControl
              type="text"
              ref="summonerId"
              name="summonerId"
              placeholder="summoner id"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>server</ControlLabel>
            <FormControl
              type="text"
              ref="server"
              name="server"
              placeholder="server"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Community name</ControlLabel>
            <FormControl
              type="text"
              ref="communityName"
              name="communityName"
              placeholder="community name"
            />
          </FormGroup>



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
