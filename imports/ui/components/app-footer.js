import React from 'react';
import { Navbar, Grid } from 'react-bootstrap';
import { Link } from 'react-router';

const footerStyle = {border:'none'};

export default  class AppNavigation extends React.Component {
  render() {
    return(
      <Navbar fixedBottom style={footerStyle}>
        <hr />
        <div>
        </div>
      </Navbar>
  );
  }
}
