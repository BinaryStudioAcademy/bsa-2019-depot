import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Grid, Menu, Divider } from 'semantic-ui-react';

import { SettingsProfile } from '../../scenes';
import { fetchCurrentUser } from '../../routines/routines';

class Routing extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return (
      <>
        <Divider hidden />
        <Grid container>
          <Grid.Column computer={4} tablet={8} mobile={16}>
            <Menu vertical>
              <Menu.Item header>Personal settings</Menu.Item>
              <Menu.Item>Profile</Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column computer={12} tablet={16} mobile={16}>
            <Switch>
              <Route exact path="/profile" component={SettingsProfile} />
            </Switch>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

Routing.propTypes = {
  loading: PropTypes.bool.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ profile: { loading } }) => ({
  loading
});

const mapDispatchToProps = {
  fetchCurrentUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routing);
