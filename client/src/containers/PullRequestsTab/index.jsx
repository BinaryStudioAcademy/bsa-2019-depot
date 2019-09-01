import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { fetchCurrentRepo } from '../../routines/routines';
import { getPulls } from '../../services/pullRequestsService';
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
      },
      pulls: []
    };
  }

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
    } else {
      const pulls = await getPulls({
        repositoryId
      });
      this.setState({ pulls });
    }
  }

  onChangeFilter = filter => {
    this.setState({
      filter
    });
  };

  render() {
    const { loading } = this.props;
    const { onChangeFilter, pulls } = this.state;

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
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
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
