import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import RepositoryHeader from '../../components/RepositoryHeader';
import IssuesTab from '../../containers/IssuesTab/index';
import CommitsPage from '../../containers/CommitsPage/index';
import DiffCommitView from '../../components/DiffCommitView/index';
import RepositoryTab from '../../containers/RepositoryTab';
import RepoSettings from '../../containers/SettingsTab/index';
import FileViewPage from '../../containers/FileViewPage';
import FileEditPage from '../../containers/FileEditPage';
import PrivateRoute from '../../containers/PrivateRoute';

import './styles.module.scss';

class RepositoryPage extends React.Component {
  render() {
    const { match, location } = this.props;
    const { username, reponame } = match.params;

    // Mocks
    const issueCount = 14;
    const forkCount = 22;

    return (
      <>
        <RepositoryHeader
          owner={username}
          repoName={reponame}
          issueCount={issueCount}
          forkCount={forkCount}
          activePage={location.pathname.split('/')[3]}
          baseUrl={match.url}
        />
        <div className="ui bottom attached active tab">
          <Switch>
            <Route exact path={`${match.path}/`} component={RepositoryTab} />
            <Route path={`${match.path}/tree/:branch`} component={RepositoryTab} />
            <Route exact path={`${match.path}/commits/:branch`} component={CommitsPage} />
            <Route exact path={`${match.path}/commit/:hash`} component={DiffCommitView} />
            <Route exact path={`${match.path}/issues`} component={IssuesTab} />
            <Route exact path={`${match.path}/settings`} component={RepoSettings} />
            <PrivateRoute path={[`${match.path}/new`, `${match.path}/edit`]} component={FileEditPage} />
            <Route path={`${match.path}/blob`} component={FileViewPage} />
          </Switch>
        </div>
      </>
    );
  }
}

RepositoryPage.propTypes = {
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

export default RepositoryPage;
