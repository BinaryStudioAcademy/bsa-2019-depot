import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import parse from 'parse-diff';
import { Label, Icon, Container, Loader, Segment } from 'semantic-ui-react';
import { Switch, Route, Link } from 'react-router-dom';

import IssuePrHeader from '../../components/IssuePrHeader';
import CommitsList from '../../components/CommitsList';
import ConversationTab from '../ConversationTab';
import PrDiffs from '../PrDiffs';
import { getAvailableReviewers } from '../../services/pullReviewersService';

import {
  getPullByNumber,
  getPullComments,
  getBranchDiffs,
  updatePull,
  getReviewers
} from '../../services/pullsService';
import { getLabels } from '../../services/labelsService';
import { getWriteUserPermissions } from '../../helpers/checkPermissionsHelper';

import styles from './styles.module.scss';

class PullView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPull: {},
      commitsCount: 0,
      loading: true,
      comment: '',
      rate: 0
    };

    this.renderComponent = this.renderComponent.bind(this);
  }
  async componentDidMount() {
    const {
      match: {
        params: { username, reponame, number }
      },
      repositoryId,
      userId
    } = this.props;
    const currentPull = await getPullByNumber(username, reponame, number);
    const labels = await getLabels(repositoryId);
    this.setState({ labels });
    const { fromCommitId, toCommitId, id } = currentPull;
    const collaborators = await getAvailableReviewers(repositoryId, userId);
    const reviewers = await getReviewers(currentPull.id);

    const { commits, diffs } = await getBranchDiffs(repositoryId, { fromCommitId, toCommitId });
    this.getLineChanges(diffs);
    const pullComments = await getPullComments(id);
    const isAccessGranted = await getWriteUserPermissions(username, reponame, userId);
    this.setState({
      currentPull,
      filesCount: diffs.split('diff --git').length - 1,
      commitsCount: commits.length,
      pullCommits: commits,
      pullComments,
      pullDiffs: diffs,
      isAccessGranted,
      collaborators,
      reviewers,
      loading: false
    });
  }

  getLineChanges = diffs => {
    const files = parse(diffs);
    let deletions = 0;
    let additions = 0;
    files.forEach(file => {
      deletions += file.deletions;
      additions += file.additions;
    });
    this.setState({
      lineChanges: {
        deletions,
        additions
      },
      rate: additions / deletions
    });
  };

  onPullUpdateTitle = async title => {
    const { id, body } = this.state.currentPull;
    return await updatePull({ id, title, body });
  };

  isOwnPull = () => {
    const { userId } = this.props;
    const { isAccessGranted, currentPull } = this.state;
    const { userId: pullUserId } = currentPull;
    return userId === pullUserId || isAccessGranted;
  };

  getStatusColor = status => {
    let color;
    switch (status) {
    case 'OPEN':
      color = 'green';
      break;
    case 'CLOSED':
      color = 'red';
      break;
    case 'MERGED':
      color = 'purple';
      break;
    default:
      color = 'green';
    }
    return color;
  };

  getStatusText = commitsCount => {
    const {
      toBranch: { name: toBranch },
      fromBranch: { name: fromBranch },
      updatedAt,
      createdAt,
      prstatus: { name }
    } = this.state.currentPull;

    let statusText = '';
    switch (name) {
    case 'OPEN':
      statusText = `wants to merge ${commitsCount} commit into ${toBranch} from ${fromBranch} · ${moment(
        createdAt
      ).fromNow()}`;
      break;
    case 'CLOSED':
      statusText = `wanted to merge ${commitsCount} commit into ${toBranch} from ${fromBranch} · ${moment(
        updatedAt
      ).fromNow()}`;
      break;
    case 'MERGED':
      statusText = `merged ${commitsCount} commit into ${toBranch} from ${fromBranch} · ${moment(
        updatedAt
      ).fromNow()}`;
      break;
    default:
      statusText = 'green';
    }
    return statusText;
  };

  renderComponent(Component, props) {
    return <Component {...props} />;
  }

  updateState = state => {
    this.setState(state);
  };

  render() {
    const {
      match,
      location: { pathname },
      userId
    } = this.props;
    const {
      currentPull,
      loading,
      commitsCount,
      pullComments,
      lineChanges,
      rate,
      filesCount,
      pullCommits,
      pullDiffs,
      labels,
      reviewers,
      collaborators
    } = this.state;
    const { id: currentPullId, pullLabels } = currentPull;
    const baseUrl = match.url;
    const activePage = pathname.split('/')[5];

    const isReviewer = loading ? null : reviewers.map(({ userId: reviewerId }) => reviewerId).includes(userId);

    let activeTab;
    switch (activePage) {
    case 'conversation':
      activeTab = 'conversation';
      break;
    case 'commits':
      activeTab = 'commits';
      break;
    case 'files-changed':
      activeTab = 'files-changed';
      break;
    default:
      activeTab = 'conversation';
    }

    return !loading ? (
      <Segment basic>
        <IssuePrHeader
          title={currentPull.title}
          number={+currentPull.number}
          canEdit={this.isOwnPull()}
          onSubmit={this.onPullUpdateTitle}
          isIssue={false}
        />
        <div>
          <Label color={this.getStatusColor(currentPull.prstatus.name)} className={styles.pull_label}>
            <Icon name="exclamation circle" /> {currentPull.prstatus.name}
          </Label>
          <span className={styles.comment_author_name}>
            {`${currentPull.user.username} `}
            <span>{this.getStatusText(commitsCount)}</span>
          </span>
        </div>
        <div className="ui top attached tabular menu">
          <div className={`${activeTab === 'conversation' && 'active'} item`}>
            <Link to={baseUrl}>
              Conversation <Label circular>{pullComments.data.length}</Label>
            </Link>
          </div>
          <div className={`${activeTab === 'commits' && 'active'} item`}>
            <Link to={`${baseUrl}/commits`}>
              Commits<Label circular>{commitsCount}</Label>
            </Link>
          </div>
          <div className={`${activeTab === 'files-changed' && 'active'} item`}>
            <Link to={`${baseUrl}/files-changed`}>
              Files changed<Label circular>{filesCount}</Label>
            </Link>
          </div>
          <div className={`${styles.last} item`}>
            <span className={styles.green}>{`+${lineChanges.additions}`}</span>
            <span className={styles.red}>{`-${lineChanges.deletions}`}</span>
            <span className={styles.block_container}>
              <span className={`${rate > 0.25 ? styles.block_added : styles.block_deleted}`}></span>
              <span className={`${rate > 0.75 ? styles.block_added : styles.block_deleted}`}></span>
              <span className={`${rate > 1.25 ? styles.block_added : styles.block_deleted}`}></span>
              <span className={`${rate > 1.5 ? styles.block_added : styles.block_deleted}`}></span>
              <span className={styles.block_neutral}></span>
            </span>
          </div>
        </div>
        <Container>
          <Switch>
            {/* eslint-disable react/jsx-no-bind */}
            <Route
              exact
              path={`${match.path}/commits`}
              render={() => this.renderComponent(CommitsList, { commits: pullCommits })}
            />
            {/* eslint-disable react/jsx-no-bind */}
            <Route
              exact
              path={`${match.path}/files-changed`}
              render={() =>
                this.renderComponent(PrDiffs, {
                  diffs: pullDiffs,
                  currentUserId: userId,
                  currentPullId: currentPullId,
                  isReviewer,
                  reviewStatus: isReviewer
                    ? reviewers.find(({ userId: reviewerId }) => reviewerId === userId).status.name
                    : null,
                  pullUrl: match.url
                })
              }
            />
            {/* eslint-disable react/jsx-no-bind */}
            <Route
              exact
              path={`${match.path}/`}
              component={() => (
                <ConversationTab
                  currentPull={currentPull}
                  pullComments={pullComments}
                  isOwnPull={this.isOwnPull()}
                  updateState={this.updateState}
                  currentLabels={pullLabels}
                  labels={labels}
                  reviewers={reviewers}
                  collaborators={collaborators}
                />
              )}
            />
          </Switch>
        </Container>
      </Segment>
    ) : (
      <Loader active />
    );
  }
}

PullView.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.object,
  history: PropTypes.object.isRequired,
  repositoryId: PropTypes.string,
  userId: PropTypes.string
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id }
    }
  },
  profile: {
    currentUser: { id: userId }
  }
}) => ({
  repositoryId: id,
  userId
});

export default connect(mapStateToProps)(PullView);
