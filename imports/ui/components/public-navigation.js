import React from 'react';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

export const PublicNavigation = () => (
  <div>
    <Nav>

      <LinkContainer to="/communities">
        <NavItem eventKey={ 2 } href="/communities">Communities</NavItem>
      </LinkContainer>
    </Nav>

    <Nav pullRight>
      <LinkContainer to="signup">
        <NavItem eventKey={ 1 } href="/signup">Sign Up</NavItem>
      </LinkContainer>
      <LinkContainer to="login">
        <NavItem eventKey={ 2 } href="/login">Log In</NavItem>
      </LinkContainer>
    </Nav>
  </div>
);
