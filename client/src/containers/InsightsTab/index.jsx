import React from 'react';
import { Switch, NavLink, Route, Redirect } from 'react-router-dom';
import { Grid, Menu, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ForksPage from '../ForksPage';
import CommitsInsight from '../CommitsInsight';
import ContributorsInsights from '../ContributorsInsights';

const InsightsTab = ({ match }) => {
  function defaultRedirect(props) {
    return <Redirect {...props} to={`${props.match.url}/forks`} />;
  }

  return (
    <>
      <Divider hidden />
      <Grid container>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <Menu vertical>
            <Menu.Item header>Insights</Menu.Item>
            <NavLink to={`${match.url}/forks`} activeClassName="active">
              <Menu.Item>Forks</Menu.Item>
            </NavLink>
            <NavLink to={`${match.url}/commits`} activeClassName="active">
              <Menu.Item>Commits</Menu.Item>
            </NavLink>
            <NavLink to={`${match.url}/contributors`} activeClassName="active">
              <Menu.Item>Contributors</Menu.Item>
            </NavLink>
          </Menu>
        </Grid.Column>
        <Grid.Column computer={12} tablet={8} mobile={16}>
          <Switch>
            <Route exact path={`${match.path}`} render={defaultRedirect} />
            <Route exact path={`${match.path}/forks`} component={ForksPage} />
            <Route exact path={`${match.path}/commits`} component={CommitsInsight} />
            <Route exact path={`${match.path}/contributors`} component={ContributorsInsights} />
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
