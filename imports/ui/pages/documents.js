import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DocumentsListContainer from '../containers/documents-list-container';
import { AddDocument } from '../components/add-document.js';

export const Documents = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Documents</h4>
      <AddDocument />
      <DocumentsListContainer />
    </Col>
  </Row>
);
