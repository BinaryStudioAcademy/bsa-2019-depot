import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { fetchPullRequests, fetchCurrentRepo } from '../../routines/routines';
import IssuePrContainer from '../IssuePrContainer';

class PullRequestsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        title: '',
        author: '',
        assignees: [],
        opened: true
      }
    };
  }

  componentDidMount() {
    const {
      repositoryId,
      fetchPullRequests,
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const { filter } = this.state;
    if (!repositoryId) {
      fetchCurrentRepo({ username, reponame });
    } else {
      fetchPullRequests({
        repositoryId,
        filter
      });
    }
  }

  onChangeFilter = filter => {
    this.setState({
      filter
    });
  };

  render() {
    const { loading, pulls } = this.props;
    const { onChangeFilter } = this.state;

    return loading ? (
      <Loader active />
    ) : (
      <IssuePrContainer data={pulls} isIssues={false} onChangeFilter={onChangeFilter} />
    );
  }
}

PullRequestsTab.propTypes = {
  reponame: PropTypes.string,
  repositoryId: PropTypes.string,
  pulls: PropTypes.array,
  pullsData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    pulls: PropTypes.array
  }),
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  fetchPullRequests: PropTypes.func.isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  pullsData: { loading, pulls },
  currentRepo: {
    currentRepoInfo: { id }
  }
}) => ({
  loading,
  pulls,
  repositoryId: id
});

const mapDispatchToProps = {
  fetchPullRequests,
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PullRequestsTab);
