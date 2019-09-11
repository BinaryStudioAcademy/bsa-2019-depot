import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { getAdminUserPermissions } from '../../helpers/checkPermissionsHelper';

const renderComponent = ({ Component, ...rest }) => <Component {...rest} />;

const PrivateTab = ({ username, location, ...props }) => {
  const [owner, reponame] = location.pathname
    .split('/')
    .filter(urlPart => urlPart)
    .slice(0, 2);

  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPermissions = async () => {
    const { userId } = props;
    const accessPermissions = await getAdminUserPermissions(owner, reponame, userId);
    setIsAccessGranted(accessPermissions);
    setIsLoading(false);
  };

  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loader active />;
  }
  return (username && username === owner) || isAccessGranted ? (
    <Route {...props} render={renderComponent} />
  ) : (
    <Redirect to={{ pathname: `/${owner}/${reponame}`, state: { from: location } }} />
  );
};

PrivateTab.propTypes = {
  userId: PropTypes.string,
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
    currentUser: { id: userId, username }
  }
}) => ({ userId, username });

export default connect(mapStateToProps)(PrivateTab);
