import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const renderComponent = ({ Component, ...rest }) => <Component {...rest} />;

const PrivateTab = ({ username, location, ...props }) => {
  const [owner, reponame] = location.pathname
    .split('/')
    .filter(urlPart => urlPart)
    .slice(0, 2);

  return username && username === owner ? (
    <Route {...props} render={renderComponent} />
  ) : (
    <Redirect to={{ pathname: `/${owner}/${reponame}`, state: { from: location } }} />
  );
};

PrivateTab.propTypes = {
  username: PropTypes.string,
  location: PropTypes.exact({
    key: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired
};

renderComponent.propTypes = {
  Component: PropTypes.any
};

const mapStateToProps = ({
  profile: {
    currentUser: { username }
  }
}) => ({ username });

export default connect(mapStateToProps)(PrivateTab);
