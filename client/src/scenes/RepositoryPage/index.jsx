import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import RepositoryHeader from '../../components/RepositoryHeader';
import IssuesTab from '../../containers/IssuesTab/index';
import RepoSettings from '../../containers/SettingsTab/index';
import { fetchCurrentRepo } from '../../routines/routines';

class RepositoryPage extends React.Component {
  async componentDidMount() {
    const {
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      }
    } = this.props;

    fetchCurrentRepo({ username, reponame });
  }

  render() {
    const {
      match,
      issues,
      location: { pathname }
    } = this.props;
    const { username, reponame } = match.params;

    return (
      <div></div>
    )
  }
}

RepositoryPage.propTypes = {
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.any,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
      reponame: PropTypes.string.isRequired,
      branch: PropTypes.string
    })
  })
};

const mapDispatchToProps = {
  fetchCurrentRepo
};

export default connect(
  null,
  mapDispatchToProps
)(RepositoryPage);
