import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { getUserRights } from '../../services/permissionService';

const renderComponent = ({ Component, ...rest }) => <Component {...rest} />;

const PrivateTab = ({ username, location, ...props }) => {
  const [owner, reponame] = location.pathname
    .split('/')
    .filter(urlPart => urlPart)
    .slice(0, 2);

  // const [accessPermissions, setAccessPermissions] = useState('ADMIN');

  const getPermissions = async () => {
    // const { userId } = props;
    // const response = (await getUserRights(owner, reponame, userId))[0];
    // if (response) {
    //   const {
    //     permission: { name }
    //   } = response;
    // setAccessPermissions(name);
    // }
  };

  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // return (username && username === owner) || accessPermissions === 'ADMIN' ? (
  return username && username === owner ? (
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
