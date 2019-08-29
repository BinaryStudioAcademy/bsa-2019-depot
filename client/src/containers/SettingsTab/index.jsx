import React from 'react';
import { Switch, NavLink } from 'react-router-dom';
import { Grid, Menu, Divider } from 'semantic-ui-react';
import PrivateRoute from '../../containers/PrivateRoute';
import PropTypes from 'prop-types';
import RepositoryOptions from '../RepositoryOptions';
import CollaboratorsPage from '../CollaboratorsPage/index';

const RepoSettings = ({ match }) => {
  return (
    <>
      <Divider hidden />
      <Grid container>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <Menu vertical>
            <NavLink to={`${match.url}`} activeClassName="active">
              <Menu.Item>Options</Menu.Item>
            </NavLink>
            <NavLink to={`${match.url}/collaboration`} activeClassName="active">
              <Menu.Item>Collaborators</Menu.Item>
            </NavLink>
          </Menu>
        </Grid.Column>
        <Grid.Column computer={12} tablet={16} mobile={16}>
          <Switch>
            <PrivateRoute exact path={`${match.path}`} component={RepositoryOptions} />
            <PrivateRoute exact path={`${match.path}/collaboration`} component={CollaboratorsPage} />
          </Switch>
        </Grid.Column>
      </Grid>
    </>
  );
};

RepoSettings.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default RepoSettings;
