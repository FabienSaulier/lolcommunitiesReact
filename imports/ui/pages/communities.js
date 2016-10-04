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
