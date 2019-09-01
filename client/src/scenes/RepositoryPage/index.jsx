import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import RepositoryHeader from '../../components/RepositoryHeader';
import IssuesTab from '../../containers/IssuesTab/index';
import PullRequestsTab from '../../containers/PullRequestsTab';
import IssueComments from '../../components/IssueComments/index';
import CommitsPage from '../../containers/CommitsPage/index';
import DiffCommitView from '../../components/DiffCommitView/index';
import RepoSettings from '../../containers/SettingsTab/index';
import FileViewPage from '../../containers/FileViewPage';
import FileEditPage from '../../containers/FileEditPage';
import BranchesTab from '../../containers/BranchesTab/index';
import CreateIssuePage from '../../containers/CreateIssuePage';
import PrivateTab from '../../containers/PrivateTab';
import { fetchCurrentRepo } from '../../routines/routines';
import { clearRepoState } from './actions';
import Spinner from '../../components/Spinner';
import CodeTab from '../../scenes/CodeTab';
import { socketInit } from '../../helpers/socketInitHelper';

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeToPivate = this.onChangeToPivate.bind(this);
  }

  componentDidMount() {
    const {
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      }
    } = this.props;

    fetchCurrentRepo({ username, reponame });
    this.initSocket();
  }

  componentWillUnmount() {
    this.props.clearRepoState();
    const { id } = this.props;
    this.socket.emit('leaveRoom', id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      const { id } = this.props;
      this.socket.emit('createRoom', id);
    }
  }

  onChangeToPivate(changedRepoId) {
    const {
      id: repoId,
      userId,
      owner: { username: repoOwnerName, id: repoOwnerId }
    } = this.props;

    if (changedRepoId === repoId && repoOwnerId !== userId) {
      this.props.history.push(`/${repoOwnerName}`);
    }
  }

  initSocket() {
    this.socket = socketInit('repos');

    this.socket.on('changedToPrivate', this.onChangeToPivate);
  }

  render() {
    const {
      match,
      issuesCount,
      pullCount,
      branches,
      defaultBranch,
      location: { pathname },
      loading
    } = this.props;
    const { username, reponame } = match.params;

    const branchExists = pathname.match(/tree\/.+/);
    let branch = '';
    if (branchExists) branch = branchExists[0].split('/')[1]; // branchExists[0] has format 'tree/nameOfBranch/...'
    branch = branch || defaultBranch || branches[0];
    const pathToDir = pathname.replace(`${match.url}/tree/${branch}`, '').split('/');
    const params = pathToDir
      .filter(path => path)
      .map(param => `:${param}`)
      .join('/');

    if (loading) {
      return <Spinner />;
    }

    return (
      <>
        <RepositoryHeader
          owner={username}
          repoName={reponame}
          issueCount={issuesCount}
          pullCount={pullCount}
          activePage={pathname.split('/')[3]}
          baseUrl={match.url}
        />
        <Container>
          <Switch>
            <Route exact path={`${match.path}`} component={CodeTab} />
            <Route exact path={`${match.path}/tree/:branch`} component={CodeTab} />
            <Route exact path={`${match.path}/tree/:branch/${params}`} component={CodeTab} />
            <Route exact path={`${match.path}/commits/:branch`} component={CommitsPage} />
            <Route exact path={`${match.path}/commit/:hash`} component={DiffCommitView} />
            <Route exact path={`${match.path}/issues`} component={IssuesTab} />
            <Route exact path={`${match.path}/pulls`} component={PullRequestsTab} />
            <Route exact path={`${match.path}/issues/new`} component={CreateIssuePage} />
            <Route exact path={`${match.path}/issues/:number`} component={IssueComments} />
            <PrivateTab exact path={`${match.path}/settings`} component={RepoSettings} />
            <Route exact path={`${match.path}/branches`} component={BranchesTab} />
            <PrivateTab path={[`${match.path}/new/:branch`, `${match.path}/edit/:branch`]} component={FileEditPage} />
            <Route path={`${match.path}/blob/:branch`} component={FileViewPage} />
          </Switch>
        </Container>
      </>
    );
  }
}
RepositoryPage.propTypes = {
  fetchCurrentRepo: PropTypes.func.isRequired,
  clearRepoState: PropTypes.func.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.exact({
    key: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired,
  id: PropTypes.string.isRequired,
  issuesCount: PropTypes.string,
  branches: PropTypes.array.isRequired,
  defaultBranch: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  owner: PropTypes.object,
  history: PropTypes.object
};
const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id, issuesCount, pullCount, branches, defaultBranch, user: owner },
      loading
    }
  },
  profile: {
    currentUser: { id: userId }
  }
}) => ({ id, issuesCount, pullCount, branches, defaultBranch, loading, owner, userId });
const mapDispatchToProps = {
  fetchCurrentRepo,
  clearRepoState
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryPage);
