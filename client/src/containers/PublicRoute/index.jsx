import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const renderComponent = ({ Component, ...rest }) => <Component {...rest} />;

const PublicRoute = ({ isAuthorized, hasUsername, username, location, ...props }) => {
  if (!isAuthorized && !hasUsername) {
    return <Route {...props} render={renderComponent} />;
  }

  const { state } = location;
  if (state && state.from.pathname.includes('/login')) {
    return <Route {...props} render={renderComponent} />;
  }

  if (isAuthorized && !hasUsername) {
    return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
  }
  return <Redirect to={{ pathname: `/${username}`, state: { from: location } }} />;
};

PublicRoute.propTypes = {
  isAuthorized: PropTypes.bool,
  hasUsername: PropTypes.bool,
  location: PropTypes.any,
  username: PropTypes.string
};

renderComponent.propTypes = {
  Component: PropTypes.any
};

PublicRoute.defaultProps = {
  location: undefined
};

const mapStateToProps = ({ profile }) => {
  return {
    isAuthorized: profile.isAuthorized,
    hasUsername: Boolean(profile.currentUser.username),
    username: profile.currentUser.username
  };
};

export default connect(mapStateToProps)(PublicRoute);
