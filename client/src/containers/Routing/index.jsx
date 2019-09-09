import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import PublicRoute from '../PublicRoute';
import Spinner from '../../components/Spinner';
import { NotFound, Login, Forgot, Reset, MainPage, Signup, Dashboard, CreateRepository } from '../../scenes';
import Settings from '../../scenes/Settings';
import CreateOrganization from '../../scenes/CreateOrganization';
import { fetchCurrentUser } from '../../routines/routines';
import OrganizationPeople from '../../scenes/OrganizationPeople';
import Header from '../Header';
import Footer from '../../components/Footer';
import Invitation from '../../scenes/Invitation';
import RepositoryPage from '../../scenes/RepositoryPage';
import Issues from '../../scenes/Issues';
import PullRequests from '../../scenes/PullRequests';

import './styles.module.scss';

class Routing extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    const { loading, isAuthorized, username } = this.props;

    return loading ? (
      <Spinner />
    ) : (
      <section className={'main-wrapper' + (!isAuthorized || (isAuthorized && !username) ? ' auth-wrapper' : '')}>
        <div className="content">
          <Header />
          <Switch>
            <PrivateRoute exact path="/not-found" component={NotFound} />
            <Route exact path="/mobile" component={NotFound} />
            <PublicRoute exact path="/registration" component={Signup} />
            <PublicRoute exact path="/login" component={Login} />
            <PublicRoute exact path="/" component={MainPage} />
            <PublicRoute exact path="/forgot" component={Forgot} />
            <PublicRoute exact path="/reset/:hash" component={Reset} />
            <PrivateRoute path="/settings" component={Settings} />
            <PrivateRoute exact path="/organizations/new" component={CreateOrganization} />
            <PrivateRoute exact path="/orgs/:name/people" component={OrganizationPeople} />
            <PrivateRoute exact path="/orgs/:name/invitation" component={Invitation} />
            <PrivateRoute exact path="/new" component={CreateRepository} />
            <PrivateRoute exact path="/import" component={NotFound} />
            <PrivateRoute exact path="/organizations/:orgname/repositories/new" component={CreateRepository} />
            <PrivateRoute exact path="/:username" component={Dashboard} />
            <PrivateRoute exact path="/:username/issues" component={Issues} />
            <PrivateRoute exact path="/:username/pull-requests" component={PullRequests} />
            <PrivateRoute path="/:username/:reponame" component={RepositoryPage} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </section>
    );
  }
}

Routing.propTypes = {
  loading: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
  username: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    loading,
    isAuthorized,
    currentUser: { username }
  }
}) => ({
  loading,
  isAuthorized,
  username
});

const mapDispatchToProps = {
  fetchCurrentUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routing);
