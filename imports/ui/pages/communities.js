
import React from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import CommunitiesListContainer from '../containers/communities-list-container';
//, FormGroup, ControlLabel, FormControl, Button

export class Communities extends React.Component {

  constructor(props) {
    super(props);
    this.state = {envie:"dormir"};
    this.testcall = this.testcall.bind(this);
  }

  testcall(){
    console.log(this.state);
    if(this.state.envie === "dormir")
      this.setState({envie:"manger"});
    else
      this.setState({envie:"dormir"});
  }



  render() {
    console.log(this.state);
    return (
    <Row>
      <Col xs={ 12 }>
        <h4 className="page-header">Communities</h4>
        <CommunitiesListContainer  testcall={ this.testcall } envie={this.state.envie}/>
      </Col>
    </Row>
    );
  }
}

/*

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CommunitiesListContainer from '../containers/communities-list-container';



export const Communities = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Communities</h4>
      <CommunitiesListContainer />
    </Col>
  </Row>
);

*/
