import React from 'react';
import { Switch, NavLink, Route, Redirect } from 'react-router-dom';
import { Grid, Menu, Divider } from 'semantic-ui-react';
import PrivateRoute from '../../containers/PrivateRoute';
import PropTypes from 'prop-types';

import { SettingsProfile } from '../../scenes';
import KeysPage from '../../containers/KeysPage';
import NewKeysPage from '../../containers/NewKeyPage';
import OrganizationsPage from '../../containers/OrganizationsPage';

const redirectToProfile = () => <Redirect to="/settings/profile" />;

const Settings = ({ match }) => {
  return (
    <>
      <Divider hidden />
      <Grid container>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <Menu vertical>
            <Menu.Item header>Personal settings</Menu.Item>
            <NavLink to={`${match.url}/profile`} activeClassName="active">
              <Menu.Item>Profile</Menu.Item>
            </NavLink>
            <NavLink to={`${match.url}/keys`} activeClassName="active">
              <Menu.Item>SSH Keys</Menu.Item>
            </NavLink>
            <NavLink to={`${match.url}/organizations`} activeClassName="active">
              <Menu.Item>Organizations</Menu.Item>
            </NavLink>
          </Menu>
        </Grid.Column>
        <Grid.Column computer={12} tablet={16} mobile={16}>
          <Switch>
            <Route exact path={`${match.path}`} render={redirectToProfile} />
            <PrivateRoute path={`${match.path}/profile`} component={SettingsProfile} />
            <PrivateRoute path={`${match.path}/keys/new`} component={NewKeysPage} />
            <PrivateRoute path={`${match.path}/keys`} component={KeysPage} />
            <PrivateRoute path={`${match.path}/organizations`} component={OrganizationsPage} />
          </Switch>
        </Grid.Column>
      </Grid>
    </>
  );
};

Settings.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default Settings;
