import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import PublicRoute from '../PublicRoute';
import Spinner from '../../components/Spinner';
import { NotFound, Login, Forgot, Reset, MainPage, Signup, Dashboard, CreateRepository } from '../../scenes';
import Settings from '../../scenes/Settings';
import { fetchCurrentUser } from '../../routines/routines';
import RepositoryPage from '../../scenes/Repository';
import Header from '../Header';
import Footer from '../../components/Footer';
import InviteMembersTab from '../InviteMembersTab';
import Invitation from '../../scenes/Invitation';

import './styles.module.scss';

class Routing extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    const { loading } = this.props;

    return loading ? (
      <Spinner />
    ) : (
      <section className="main-wrapper">
        <div className="content">
          <Header />
          <Switch>
            <PrivateRoute exact path="/orgs/:name/invite" component={InviteMembersTab} />
            <PrivateRoute exact path="/orgs/:name/invitation" component={Invitation} />
            <PublicRoute exact path="/registration" component={Signup} />
            <PublicRoute exact path="/login" component={Login} />
            <PublicRoute exact path="/" component={MainPage} />
            <PublicRoute exact path="/forgot" component={Forgot} />
            <PublicRoute exact path="/reset/:hash" component={Reset} />
            <PrivateRoute path="/settings" component={Settings} />
            <PrivateRoute exact path="/new" component={CreateRepository} />
            <PrivateRoute exact path="/:username" component={Dashboard} />
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
