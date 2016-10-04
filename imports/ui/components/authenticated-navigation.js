import React from 'react';
import { browserHistory } from 'react-router';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const handleLogout = () => Meteor.logout(() => browserHistory.push('/login'));
const handleProfil = () => browserHistory.push('/profil');

const summonerName = () => {
  const user = Meteor.user();
  const summonerName = user.profile.summonerName;
  return summonerName;
};

export const AuthenticatedNavigation = () => (
  <div>
    <Nav>
      <IndexLinkContainer to="/">
        <NavItem eventKey={ 1 } href="/">Index</NavItem>
      </IndexLinkContainer>
      <LinkContainer to="/documents">
        <NavItem eventKey={ 2 } href="/documents">Documents</NavItem>
      </LinkContainer>
      <LinkContainer to="/communities">
        <NavItem eventKey={ 2 } href="/communities">Communities</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={ 3 } title={ summonerName() } id="basic-nav-dropdown">
        <MenuItem eventKey={ 3.1 } onClick={ handleProfil }>Profil</MenuItem>
        <MenuItem eventKey={ 3.2 } onClick={ handleLogout }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);
