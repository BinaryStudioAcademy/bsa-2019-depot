import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import RepositoryHeader from '../../components/RepositoryHeader';
import IssuesTab from '../../containers/IssuesTab/index';
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
import CollaboratorInvitation from '../../containers/CollaboratorInvitation';
import { getAllUserPermissions } from '../../helpers/checkPermissionsHelper';

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccessGranted: false
    };
  }

  async componentDidMount() {
    const {
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      },
      userId
    } = this.props;

    const isAccessGranted = await getAllUserPermissions(username, reponame, userId);
    fetchCurrentRepo({ username, reponame });
    this.setState({
      isAccessGranted
    });
  }

  componentWillUnmount() {
    this.props.clearRepoState();
  }

  render() {
    const {
      match,
      issuesCount,
      branches,
      defaultBranch,
      location: { pathname },
      owner,
      isPublic,
      loading
    } = this.props;
    const { isAccessGranted } = this.state;
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

    return username === owner || isPublic || isAccessGranted ? (
      <>
        <RepositoryHeader
          owner={username}
          repoName={reponame}
          issueCount={issuesCount}
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
            <Route exact path={`${match.path}/issues/new`} component={CreateIssuePage} />
            <Route exact path={`${match.path}/issues/:number`} component={IssueComments} />
            <PrivateTab path={`${match.path}/settings`} component={RepoSettings} />
            <Route exact path={`${match.path}/branches`} component={BranchesTab} />
            <PrivateTab path={[`${match.path}/new/:branch`, `${match.path}/edit/:branch`]} component={FileEditPage} />
            <Route path={`${match.path}/blob/:branch`} component={FileViewPage} />
            <Route exact path={`${match.path}/invitations`} component={CollaboratorInvitation} />
          </Switch>
        </Container>
      </>
    ) : (
      <Redirect to={`/${username}`} />
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
    key: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired,
  issuesCount: PropTypes.number.isRequired,
  branches: PropTypes.array.isRequired,
  defaultBranch: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id, issuesCount, branches, defaultBranch, isPublic },
      loading
    }
  },
  profile: {
    currentUser: { id: userId, username: owner }
  }
}) => ({
  id,
  userId,
  owner,
  issuesCount,
  branches,
  defaultBranch,
  isPublic,
  loading
});

const mapDispatchToProps = {
  fetchCurrentRepo,
  clearRepoState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryPage);
