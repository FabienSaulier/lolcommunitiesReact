import React from 'react';
import { Navbar, Grid } from 'react-bootstrap';
import { Link } from 'react-router';

const footerStyle = {border:'none'};

export default  class AppNavigation extends React.Component {
  render() {
    return(
      <Navbar   style={footerStyle}>
        <hr />
        <div>
          <small>Site in beta. Any suggestions, or bugs are welcome - contact: fsaulier@hotmail.com </small><br />
          <small style={{fontSize:'x-small'	}}>League Of Communities isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.</small>
        </div>
      </Navbar>
  );
  }
}
