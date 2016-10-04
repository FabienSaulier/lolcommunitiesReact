import React from 'react';
import { Grid } from 'react-bootstrap';
import AppNavigationContainer from '../containers/app-navigation-container';

export const Layout = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },
  render() {
    return <div>
      <AppNavigationContainer />
      <Grid>
        { this.props.children }
      </Grid>
    </div>;
  },
});
