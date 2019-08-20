import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class OrganizationDashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>sadasd</div>;
  }
}

OrganizationDashboard.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.exact({
    key: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired
};

export default withRouter(OrganizationDashboard);
