import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Octicon, { Repo } from '@primer/octicons-react';
import { Icon, Label, Segment, Button } from 'semantic-ui-react';
import ForkButton from '../ForkButton';
import StarButton from '../../components/StarButton';
import { setStar } from '../../services/repositoryService';
import { getAdminUserPermissions } from '../../helpers/checkPermissionsHelper';

import styles from './styles.module.scss';

const RepositoryHeader = ({
  userId,
  currentRepoInfo: { id: repositoryId, userId: repoOwnerId, originalRepo, starsCount, stars },
  owner,
  username,
  repoName,
  issueCount,
  pullCount,
  activePage,
  baseUrl,
  history,
  isPublic,
  branch
}) => {
  const [isStar, setIsStar] = useState(Boolean(stars.find(star => star.user.id === userId)));
  const [starCount, setStarCount] = useState(starsCount);
  let activeTab;
  switch (activePage) {
  case 'issues':
    activeTab = 'issues';
    break;
  case 'pulls':
    activeTab = 'pulls';
    break;
  case 'commits':
    activeTab = 'code';
    break;
  case 'insights':
    activeTab = 'insights';
    break;
  case 'settings':
    activeTab = 'settings';
    break;
  default:
    activeTab = 'code';
  }
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const getPermissions = async () => {
    const accessPermissions = await getAdminUserPermissions(owner, repoName, userId);
    setIsAccessGranted(accessPermissions);
  };

  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stargazersLinkClickHandler = useCallback(() => history.push(`/${owner}/${repoName}/stargazers`), [
    owner,
    repoName,
    history
  ]);

  const starClickHandler = useCallback(() => {
    const updatedStarCount = isStar ? Number(starCount) - 1 : Number(starCount) + 1;
    setIsStar(!isStar);
    setStarCount(updatedStarCount);

    setStar({ userId, repositoryId });
  }, [isStar, repositoryId, starCount, userId]);

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
              <Icon name="fork small" />
              forked from <a href={`/${forkedRepoOwner}/${forkedRepoName}`}>{`${forkedRepoOwner}/${forkedRepoName}`}</a>
            </span>
          </div>
        );
      }
    }
  };

  return (
    <Segment as="header" basic className={[styles.repoHeader, 'm0', 'pb-0']}>
      <div className={styles.repoNameRow}>
        <div className={styles.repoName}>
          <Octicon icon={Repo} />
          <span className={styles.repoPath}>
            <Link to={`/${owner}`}>{owner}</Link>
            <span className={styles.pathDivider}>/</span>
            <Link to={`/${owner}/${repoName}`}>{repoName}</Link>
            {!isPublic && <span className={styles.repoPrivateLabel}>Private</span>}
          </span>
          {renderOrignalRepoLink()}
        </div>
        <div>
          <Button size="small" as="div" compact labelPosition="right">
            <StarButton starClickHandler={starClickHandler} isStar={isStar} />
            <Label as="a" basic onClick={stargazersLinkClickHandler}>
              {starCount}
            </Label>
          </Button>

          {repoOwnerId !== userId ? (
            <ForkButton isOwnRepo={false} owner={owner} repoName={repoName} />
          ) : (
            <ForkButton isOwnRepo owner={owner} repoName={repoName} />
          )}
        </div>
      </div>
      <div className="ui top attached tabular menu">
        <div className={`${activeTab === 'code' && 'active'} item`}>
          <Link to={`${baseUrl}/tree/${branch}`}>
            <Icon name="code" /> Code
          </Link>
        </div>
        <div className={`${activeTab === 'issues' && 'active'} item`}>
          <Link to={`${baseUrl}/issues`}>
            <Icon name="info circle" /> Issues<Label circular>{issueCount}</Label>
          </Link>
        </div>
        <div className={`${activeTab === 'pulls' && 'active'} item`}>
          <Link to={`${baseUrl}/pulls`}>
            <Icon name="random" /> Pull Requests<Label circular>{pullCount}</Label>
          </Link>
        </div>
        <div className={`${activeTab === 'insights' && 'active'} item`}>
          <Link to={`${baseUrl}/insights`}>
            <Icon name="chart bar outline" /> Insights
          </Link>
        </div>
        {((username && username === owner) || isAccessGranted) && (
          <div className={`${activeTab === 'settings' && 'active'} item`}>
            <Link to={`${baseUrl}/settings`}>
              <Icon name="cog" /> Settings
            </Link>
          </div>
        )}
      </div>
    </Segment>
  );
};

RepositoryHeader.propTypes = {
  owner: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
  issueCount: PropTypes.string.isRequired,
  pullCount: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  currentRepoInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    starsCount: PropTypes.string.isRequired,
    stars: PropTypes.array.isRequired,
    userId: PropTypes.string,
    forksCount: PropTypes.string,
    originalRepo: PropTypes.shape({
      name: PropTypes.string,
      owner: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string
      })
    })
  }).isRequired,
  branch: PropTypes.string,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  activePage: PropTypes.string,
  baseUrl: PropTypes.string.isRequired,
  history: PropTypes.object,
  isPublic: PropTypes.bool
};

const mapStateToProps = ({
  profile: {
    currentUser: { id, username }
  },
  currentRepo: {
    repository: { currentRepoInfo }
  }
}) => ({
  userId: id,
  username,
  currentRepoInfo
});

export default connect(mapStateToProps)(withRouter(RepositoryHeader));
