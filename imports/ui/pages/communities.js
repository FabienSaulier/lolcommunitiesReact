import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CommunitiesList from '../containers/communities-list.js';

export const Communities = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Communities</h4>
      <CommunitiesList />
    </Col>
  </Row>
);
