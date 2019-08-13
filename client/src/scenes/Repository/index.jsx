import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import RepositoryHeader from '../../components/RepositoryHeader';
import IssuesTab from '../../containers/IssuesTab/index';
import CommitsPage from '../../containers/CommitsPage/index';
import RepositoryTab from '../../containers/RepositoryTab';

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
            <Route exact path={match.url} component={RepositoryTab} />
            <Route exact path={`${match.url}/issues`} component={IssuesTab} />
            <Route exact path={`${match.url}/commits`} component={CommitsPage} />
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
