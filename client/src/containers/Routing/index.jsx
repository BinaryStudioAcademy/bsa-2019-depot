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
  SettingsProfile,
  CreateRepository
} from '../../scenes';
import { fetchCurrentUser } from '../../routines/routines';
import RepositoryPage from '../../scenes/Repository';
import Header from '../Header';
import Footer from '../../components/Footer';

class Routing extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    const { loading } = this.props;

    return loading ? (
      <Spinner />
    ) : (
      <>
        <Header />
        <Switch>
          <Route exact path="/registration" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={MainPage} />
          <Route exact path="/forgot" component={Forgot} />
          <Route exact path="/reset/:hash" component={Reset} />
          <PrivateRoute exact path="/new" component={CreateRepository} />
          <PrivateRoute path="/:username/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/settings/profile" component={SettingsProfile} />
          <PrivateRoute path="/:username/:reponame" component={RepositoryPage} />
          <Route exact path="*" component={NotFound} />
        </Switch>
        <Footer />
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
