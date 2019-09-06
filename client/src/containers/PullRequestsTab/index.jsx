import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { fetchCurrentRepo } from '../../routines/routines';
import IssuesPullsList from '../../components/IssuesPullsList';

class PullRequestsTab extends React.Component {
  async componentDidMount() {
    const {
      repositoryId,
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      }
    } = this.props;
    if (!repositoryId) {
      fetchCurrentRepo({ username, reponame });
    }
  }

  render() {
    const { loading, repositoryId } = this.props;

    return loading ? <Loader active /> : <IssuesPullsList isIssues={false} repositoryId={repositoryId} />;
  }
}

PullRequestsTab.propTypes = {
  repositoryId: PropTypes.string,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id },
      loading
    }
  }
}) => ({
  repositoryId: id,
  loading
});

const mapDispatchToProps = {
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PullRequestsTab);
