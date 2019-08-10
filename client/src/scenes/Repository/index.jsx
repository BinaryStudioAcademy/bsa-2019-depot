import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import RepositoryHeader from '../../components/RepositoryHeader';
import CodeTab from '../CodeTab/index';
import IssuesTab from '../../containers/IssuesTab/index';
import CommitsPage from '../../containers/CommitsPage/index';

import './styles.module.scss';

class RepositoryPage extends React.Component {
    render() {
        const { owner, repoName, match, location } = this.props;

        // Mocks
        const issueCount = 14;
        const forkCount = 22;

        return (
      <>
        <RepositoryHeader
            owner={owner}
            repoName={repoName}
            issueCount={issueCount}
            forkCount={forkCount}
            activeTab={location.pathname.split('/')[2]}
        />
        <div className="ui bottom attached active tab">
            <Switch>
                <Route exact path={match.url} component={CodeTab} />
                <Route exact path={`${match.url}/issues`} component={IssuesTab} />
                <Route exact path={`${match.url}/commits`} component={CommitsPage} />
            </Switch>
        </div>
      </>
        );
    }
}

RepositoryPage.propTypes = {
    owner: PropTypes.string.isRequired,
    repoName: PropTypes.string.isRequired,
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

const mapStateToProps = (/* { owner, repoName } */) => ({
    owner: 'username',
    repoName: 'depot-test'
});

export default connect(mapStateToProps)(RepositoryPage);
