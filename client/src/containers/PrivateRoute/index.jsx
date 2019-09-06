import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const renderComponent = ({ Component, ...rest }) => <Component {...rest} />;

const PrivateRoute = ({ isAuthorized, hasUsername, location, ...props }) =>
  isAuthorized && hasUsername ? (
    <Route {...props} render={renderComponent} />
  ) : (
    <Redirect to={{ pathname: '/login', state: { from: location } }} />
  );

PrivateRoute.propTypes = {
  isAuthorized: PropTypes.bool,
  hasUsername: PropTypes.bool,
  location: PropTypes.any
};

renderComponent.propTypes = {
  Component: PropTypes.any
};

PrivateRoute.defaultProps = {
  location: undefined
};

const mapStateToProps = ({ profile }) => {
  return {
    isAuthorized: profile.isAuthorized,
    hasUsername: Boolean(profile.currentUser.username)
  };
};

export default connect(mapStateToProps)(PrivateRoute);
