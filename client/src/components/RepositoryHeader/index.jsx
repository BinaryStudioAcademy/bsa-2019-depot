import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Octicon, { Repo } from '@primer/octicons-react';
import { Icon, Label, Container } from 'semantic-ui-react';
import ForkButton from '../ForkButton';

import styles from './styles.module.scss';

const RepositoryHeader = ({
  userId,
  currentRepoInfo: { userId: repoOwnerId, originalRepo },
  owner,
  username,
  repoName,
  issueCount,
  activePage,
  baseUrl,
  history
}) => {
  let activeTab;
  switch (activePage) {
  case 'issues':
    activeTab = 'issues';
    break;
  case 'commits':
    activeTab = 'code';
    break;
  case 'settings':
    activeTab = 'settings';
    break;
  default:
    activeTab = 'code';
  }

  const goToRootDir = (history, url) => () => {
    history.push(url);
    window.location.reload();
  };

  const renderOrignalRepoLink = () => {
    if (originalRepo) {
      const {
        name: forkedRepoName,
        user: { username: forkedRepoOwner }
      } = originalRepo;
      if (forkedRepoName && forkedRepoOwner) {
        return (
          <div className={styles.originalRepoLink}>
            <span>
              forked from <a href={`/${forkedRepoOwner}/${forkedRepoName}`}>{`${forkedRepoOwner}/${forkedRepoName}`}</a>
            </span>
          </div>
        );
      }
    }
  };
  return (
    <header className={styles.repoHeader}>
      <Container>
        <div className={styles.repoHeaderContainer}>
          <div className={styles.repoNameRow}>
            <div className={styles.repoName}>
              <Octicon icon={Repo} />
              <span className={styles.repoPath}>
                <Link to="">{owner}</Link>
                <span className={styles.pathDivider}>/</span>
                <Link to="" onClick={goToRootDir(history, baseUrl)}>
                  {repoName}
                </Link>
              </span>
              {renderOrignalRepoLink()}
            </div>
            {repoOwnerId !== userId ? <ForkButton owner={owner} repoName={repoName} /> : null}
          </div>
          <div className="ui top attached tabular menu">
            <div className={`${activeTab === 'code' && 'active'} item`}>
              <Link to={baseUrl}>
                <Icon name="code" /> Code
              </Link>
            </div>
            <div className={`${activeTab === 'issues' && 'active'} item`}>
              <Link to={`${baseUrl}/issues`}>
                Issues<Label circular>{issueCount}</Label>
              </Link>
            </div>
            {username && username === owner && (
              <div className={`${activeTab === 'settings' && 'active'} item`}>
                <Link to={`${baseUrl}/settings`}>
                  <Icon name="cog" /> Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

RepositoryHeader.propTypes = {
  owner: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
  issueCount: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  currentRepoInfo: PropTypes.shape({
    userId: PropTypes.string,
    forkedCount: PropTypes.string,
    originalRepo: PropTypes.shape({
      name: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string
      })
    })
  }).isRequired,
  activePage: PropTypes.string,
  baseUrl: PropTypes.string.isRequired,
  history: PropTypes.object
};

const mapStateToProps = ({
  profile: {
    currentUser: { id, username }
  },
  currentRepo: { currentRepoInfo }
}) => ({
  userId: id,
  username,
  currentRepoInfo
});

export default connect(mapStateToProps)(withRouter(RepositoryHeader));
