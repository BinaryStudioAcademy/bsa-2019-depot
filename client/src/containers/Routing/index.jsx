import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Spinner from '../../components/Spinner';
import {
  NotFound,
  Login,
  Forgot,
  Reset,
  MainPage,
  Signup,
  // GoogleCallback,
  Dashboard,
  SettingsProfile
} from '../../scenes';
import { fetchCurrentUser } from '../../routines/routines';
import RepositoryPage from '../../scenes/Repository';

class Routing extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    const { loading } = this.props;

    return loading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/registration" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={MainPage} />
        <PrivateRoute exact path="/:username" component={Dashboard} />
        <PrivateRoute exact path="/forgot" component={Forgot} />
        <PrivateRoute exact path="/reset/:hash" component={Reset} />
        <PrivateRoute exact path="/settings" component={SettingsProfile} />
        <PrivateRoute path="/:username/:reponame" component={RepositoryPage} />
        <Route exact path="*" component={NotFound} />
      </Switch>
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
