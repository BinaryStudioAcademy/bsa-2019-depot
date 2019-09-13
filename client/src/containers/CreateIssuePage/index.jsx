import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createIssue, fetchCurrentRepo } from '../../routines/routines';
import { Container, Loader } from 'semantic-ui-react';
import CreateIssuePrForm from '../../components/CreateIssuePrForm';
import { getLabels } from '../../services/labelsService';
import { getAvailableAssigneesByRepoId } from '../../services/repositoryService';

class CreateIssuePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      assignees: [],
      loading: true
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const {
      repositoryId,
      fetchCurrentRepo,
      match: {
        params: { reponame, username }
      }
    } = this.props;
    if (!repositoryId) {
      fetchCurrentRepo({ username, reponame });
    }
    const labels = await getLabels(repositoryId);
    const assignees = await getAvailableAssigneesByRepoId(repositoryId);
    this.setState({ labels, assignees, loading: false });
  }

  onSubmit(title, body, labelIds, assigneeNames) {
    const {
      createIssue,
      repositoryId,
      owner,
      reponame,
      userId,
      history,
      match: { url },
      match: {
        params: { username }
      }
    } = this.props;

    const newUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');
    createIssue({
      title,
      body,
      userId,
      username,
      owner,
      reponame,
      repositoryId,
      isOpened: true,
      labelIds,
      assigneeNames,
      history,
      newUrl
    });
  }

  render() {
    const { repositoryId } = this.props;
    const { labels, assignees, loading } = this.state;
    return !loading ? (
      <Container fluid>
        <CreateIssuePrForm
          isIssues={true}
          onSubmit={this.onSubmit}
          repositoryId={repositoryId}
          labels={labels}
          assignees={assignees}
        />
      </Container>
    ) : (
      <Loader active />
    );
  }
}

CreateIssuePage.propTypes = {
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string,
  issues: PropTypes.array.isRequired,
  repositoryId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  createIssue: PropTypes.func.isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  owner: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId, username }
  },
  issuesData: { issues },
  currentRepo: {
    repository: {
      currentRepoInfo: {
        id,
        name,
        user: { username: owner }
      }
    }
  }
}) => ({
  userId,
  username,
  owner,
  issues,
  reponame: name,
  repositoryId: id
});

const mapDispatchToProps = {
  createIssue,
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIssuePage);
