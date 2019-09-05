import React from 'react';
import { Switch, NavLink, Route, Redirect } from 'react-router-dom';
import { Grid, Menu, Divider } from 'semantic-ui-react';
import PrivateRoute from '../../containers/PrivateRoute';
import PropTypes from 'prop-types';

import ForksPage from '../../containers/ForksPage';

const redirect = () => <Redirect to="/" />;

const Insights = ({ match }) => {
  return (
    <>
      <Divider hidden />
      <Grid container>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <Menu vertical>
            <NavLink to={`${match.url}/forks`} activeClassName="active">
              <Menu.Item>Forks</Menu.Item>
            </NavLink>
          </Menu>
        </Grid.Column>
        <Grid.Column computer={12} tablet={16} mobile={16}>
          <Switch>
            <Route exact path={`${match.path}`} render={redirect} />
            <PrivateRoute path={`${match.path}/forks`} component={ForksPage} />
          </Switch>
        </Grid.Column>
      </Grid>
    </>
  );
};

Insights.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default Insights;
