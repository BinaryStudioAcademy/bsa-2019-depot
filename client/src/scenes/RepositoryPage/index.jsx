import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import RepositoryHeader from '../../components/RepositoryHeader';
import RepositoryTab from '../../containers/RepositoryTab';
import IssuesTab from '../../containers/IssuesTab/index';
import IssueComments from '../../components/IssueComments/index';
import CreateIssuePage from '../../containers/CreateIssuePage';
import RepoSettings from '../../containers/SettingsTab/index';
import PrivateTab from '../../containers/PrivateTab';
import { fetchCurrentRepo } from '../../routines/routines';
import { Container } from 'semantic-ui-react';

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
            <Route exact path={`${match.path}/issues`} component={IssuesTab} />
            <Route exact path={`${match.path}/issues/new`} component={CreateIssuePage} />
            <Route exact path={`${match.path}/issues/:number`} component={IssueComments} />
            <PrivateTab exact path={`${match.path}/settings`} component={RepoSettings} />
          </Switch>
        </Container>
      </>
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
