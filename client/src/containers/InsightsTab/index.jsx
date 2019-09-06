import React from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import { Grid, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ForksPage from '../ForksPage';
import CommitsInsight from '../CommitsInsight';

const InsightsTab = ({ match }) => {
  return (
    <>
      <Grid container>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <Menu vertical>
            <NavLink to={`${match.url}/forks`} activeClassName="active">
              <Menu.Item>Forks</Menu.Item>
            </NavLink>
            <NavLink to={`${match.url}/commits`} activeClassName="active">
              <Menu.Item>Commits</Menu.Item>
            </NavLink>
          </Menu>
        </Grid.Column>
        <Grid.Column computer={12} tablet={16} mobile={16}>
          <Switch>
            <Route exact path={`${match.path}`} component={ForksPage} />
            <Route exact path={`${match.path}/forks`} component={ForksPage} />
            <Route exact path={`${match.path}/commits`} component={CommitsInsight} />
          </Switch>
        </Grid.Column>
      </Grid>
    </>
  );
};

InsightsTab.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default InsightsTab;
