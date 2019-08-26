import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import RepositoryHeader from '../../components/RepositoryHeader';
import IssuesTab from '../../containers/IssuesTab/index';
import IssueComments from '../../components/IssueComments/index';
import CommitsPage from '../../containers/CommitsPage/index';
import DiffCommitView from '../../components/DiffCommitView/index';
import RepositoryTab from '../../containers/RepositoryTab';
import RepoSettings from '../../containers/SettingsTab/index';
import FileViewPage from '../../containers/FileViewPage';
import FileEditPage from '../../containers/FileEditPage';
import BranchesTab from '../../containers/BranchesTab/index';
import CreateIssuePage from '../../containers/CreateIssuePage';
import PrivateTab from '../../containers/PrivateTab';
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

    const branchExists = pathname.match(/tree\/.+/);
    let branch = '';
    if (branchExists) branch = branchExists[0].split('/')[1]; // branchExists[0] has format 'tree/nameOfBranch/...'
    const pathToDir = pathname.replace(`${match.url}/tree/${branch || 'master'}`, '').split('/');
    const params = pathToDir
      .filter(path => path)
      .map(param => `:${param}`)
      .join('/');

    return (
      <>
        <RepositoryHeader
          owner={username}
          repoName={reponame}
          issueCount={0}
          activePage={pathname.split('/')[3]}
          baseUrl={match.url}
        />
        <Container>
          <Switch>
            <Route exact path={`${match.path}`} component={RepositoryTab} />
            <Route exact path={`${match.path}/tree/:branch`} component={RepositoryTab} />
            <Route exact path={`${match.path}/tree/:branch/${params}`} component={RepositoryTab} />
            <Route exact path={`${match.path}/commits/:branch`} component={CommitsPage} />
            <Route exact path={`${match.path}/commit/:hash`} component={DiffCommitView} />
            <Route exact path={`${match.path}/issues`} component={IssuesTab} />
            <Route exact path={`${match.path}/issues/new`} component={CreateIssuePage} />
            <Route exact path={`${match.path}/issues/:number`} component={IssueComments} />
            <PrivateTab exact path={`${match.path}/settings`} component={RepoSettings} />
            <Route exact path={`${match.path}/branches`} component={BranchesTab} />
            <PrivateTab path={[`${match.path}/new/:branch`, `${match.path}/edit/:branch`]} component={FileEditPage} />
            <Route path={`${match.path}/blob/:branch`} component={FileViewPage} />
          </Switch>
        </Container>
      </>
    )
  }
}

RepositoryPage.propTypes = {
  fetchCurrentRepo: PropTypes.func.isRequired,
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

const mapDispatchToProps = {
  fetchCurrentRepo
};

export default connect(
  null,
  mapDispatchToProps
)(RepositoryPage);
