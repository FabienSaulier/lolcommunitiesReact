
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CommunitiesListContainer from '../containers/communities-list-container';

export class Communities extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <Row>
      <Col xs={ 12 }>
        <CommunitiesListContainer />
      </Col>
    </Row>
    );
  }
}
