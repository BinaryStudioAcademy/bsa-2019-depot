import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as queryString from 'query-string';
import { Item, Loader, Segment } from 'semantic-ui-react';
import Octicon, { Comment, Diff, GitCommit, Organization } from '@primer/octicons-react';
import SelectCompareBranches from '../../components/SelectCompareBranches';
import CommitList from '../../components/CommitsList';
import { CommitCommentItem } from '../../components/CommitCommentItem';
import DiffList from '../../components/DiffList';
import CreateIssuePrForm from '../../components/CreateIssuePrForm';
import { getBranchDiffs } from '../../services/pullsService';
import { createPull } from '../../services/pullsService';
import { getLabels, setLabelsToPull } from '../../services/labelsService';
import { getAvailableReviewers } from '../../services/pullReviewersService';
import { addReviewer } from '../../services/pullReviewersService';

import styles from './styles.module.scss';

class CompareChanges extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fromBranch: this.props.branches[0],
      toBranch: this.props.branches[0],
      diffs: null,
      commits: null,
      commitComments: null,
      numOfCommits: 0,
      numOfFiles: 0,
      numOfCommitComments: 0,
      numOfContributors: 0,
      collaborators: []
    };

    this.onToBranchChange = this.onToBranchChange.bind(this);
    this.onFromBranchChange = this.onFromBranchChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateLink = this.updateLink.bind(this);
  }

  async componentDidMount() {
    const { repositoryId, branches, userId } = this.props;

    const { fromBranch: fromBranchName, toBranch: toBranchName } = this.getBranchesFromQuery();

    if (fromBranchName && toBranchName) {
      this.setState({
        fromBranch: branches.find(({ name }) => name === fromBranchName),
        toBranch: branches.find(({ name }) => name === toBranchName)
      });
    }

    const labels = await getLabels(repositoryId);
    const collaborators = await getAvailableReviewers(repositoryId, userId);
    this.setState({ labels, collaborators });
    this.updateBranchDiffs();
  }

  getBranchesFromQuery() {
    const {
      fromBranch: { name: fromBranch },
      toBranch: { name: toBranch }
    } = this.state;

    if (!this.props.location.search) {
      return {
        fromBranch,
        toBranch
      };
    }

    return {
      fromBranch: queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromBranch || fromBranch,
      toBranch: queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).toBranch || toBranch
    };
  }

  updateLink() {
    const { location, history } = this.props;
    const {
      fromBranch: { name: fromBranch },
      toBranch: { name: toBranch }
    } = this.state;
    const { fromBranchQuery, toBranchQuery } = this.getBranchesFromQuery();
    const queryParams = [];

    if (fromBranch !== fromBranchQuery) {
      queryParams.push(`fromBranch=${fromBranch}`);
    }
    if (toBranch !== toBranchQuery) {
      queryParams.push(`toBranch=${toBranch}`);
    }

    if (queryParams.length > 0) {
      const queryParamsStr = queryParams.join('&');
      history.push(`${location.pathname}?${queryParamsStr}`);
    } else {
      history.push(`${location.pathname}`);
    }
  }

  updateBranchDiffs() {
    const { repositoryId } = this.props;
    const { fromBranch, toBranch } = this.state;

    this.setState({ loading: true });
    getBranchDiffs(repositoryId, { fromCommitId: fromBranch.headCommit.id, toCommitId: toBranch.headCommit.id }).then(
      ({ diffs, commits }) => {
        const numOfFiles = diffs.split('diff --git').length - 1;
        const numOfCommitComments = commits.reduce((counter, commit) => (counter += commit.commitComments.length), 0);
        const contributors = new Set(commits.map(({ user }) => user.username));
        const commitComments = commits.flatMap(commit =>
          commit.commitComments.map(comment => ({ ...comment, commitSha: commit.sha }))
        );
        this.setState({
          loading: false,
          diffs,
          commits,
          commitComments,
          numOfCommits: commits.length,
          numOfFiles,
          numOfCommitComments,
          numOfContributors: contributors.size
        });
      }
    );
  }

  onToBranchChange(event, { value }) {
    const toBranch = this.props.branches.find(({ name }) => name === value);
    this.setState({ toBranch }, () => {
      this.updateBranchDiffs();
      this.updateLink();
    });
  }

  onFromBranchChange(event, { value }) {
    const fromBranch = this.props.branches.find(({ name }) => name === value);
    this.setState({ fromBranch }, () => {
      this.updateBranchDiffs();
      this.updateLink();
    });
  }

  onSubmit(title, body, labelIds, reviewers) {
    const { userId, repositoryId, branches, history, match } = this.props;
    const { username, reponame } = match.params;
    const { fromBranch, toBranch, collaborators } = this.state;

    const { id: fromBranchId, headCommitId: fromCommitId } = branches.find(({ name }) => name === fromBranch.name);
    const { id: toBranchId, headCommitId: toCommitId } = branches.find(({ name }) => name === toBranch.name);

    const request = {
      title,
      body,
      userId,
      repositoryId,
      fromBranchId,
      toBranchId,
      fromCommitId,
      toCommitId
    };

    this.setState({ loading: true });
    createPull(request).then(pull => {
      setLabelsToPull(labelIds, pull.data.id, repositoryId);
      reviewers.forEach(reviewer => {
        const { userId } = collaborators.find(({ user: { username } }) => username === reviewer);
        addReviewer({ userId, pullId: pull.data.id });
      });
      this.setState({ loading: false });
      history.push(`/${username}/${reponame}/pulls`);
    });
  }

  getNounEnding(quantity) {
    return quantity === 1 ? '' : 's';
  }

  render() {
    const {
      diffs,
      commits,
      commitComments,
      numOfCommits,
      numOfFiles,
      numOfCommitComments,
      numOfContributors,
      fromBranch,
      toBranch,
      loading,
      labels,
      collaborators
    } = this.state;
    const { branches, repositoryId } = this.props;

    const commentsList =
      commitComments && commitComments.length ? (
        <Item.Group>
          {commitComments.map(comment => (
            <CommitCommentItem comment={comment} key={comment.id} hash={comment.commitSha} userId={comment.userId} />
          ))}
        </Item.Group>
      ) : (
        <div className={styles.commentsInfo}>
          <h3>No commit comments for this range</h3>
        </div>
      );

    return (
      <Segment basic>
        <div className={styles.header}>
          <h1>Comparing changes</h1>
          <h5>Choose two branches to see what’s changed or to start a new pull request</h5>
        </div>
        <SelectCompareBranches
          fromBranch={fromBranch.name}
          toBranch={toBranch.name}
          branches={branches.map(({ name }) => name)}
          onToBranchChange={this.onToBranchChange}
          onFromBranchChange={this.onFromBranchChange}
        />
        {loading ? (
          <Loader active />
        ) : diffs && diffs.length && commits && commits.length ? (
          <>
            <CreateIssuePrForm
              isIssues={false}
              onSubmit={this.onSubmit}
              repositoryId={repositoryId}
              labels={labels}
              collaborators={collaborators}
            />
            <Segment className={styles.pullStats}>
              <div className={styles.pullStatSection}>
                <Octicon icon={GitCommit} />
                <b>{numOfCommits}</b> commit{this.getNounEnding(numOfCommits)}
              </div>
              <div className={styles.pullStatSection}>
                <Octicon icon={Diff} />
                <b>{numOfFiles}</b> file{this.getNounEnding(numOfFiles)} changed
              </div>
              <div className={styles.pullStatSection}>
                <Octicon icon={Comment} />
                <b>{numOfCommitComments}</b> commit comment{this.getNounEnding(numOfCommitComments)}
              </div>
              <div className={styles.pullStatSection}>
                <Octicon icon={Organization} />
                <b>{numOfContributors}</b> contributor{this.getNounEnding(numOfContributors)}
              </div>
            </Segment>
            <CommitList commits={commits} />
            <DiffList diffs={diffs} />
            {commentsList}
          </>
        ) : (
          <div className={styles.diffInfo}>
            <h3>There isn’t anything to compare.</h3>
            <p>
              {fromBranch.name === toBranch.name ? (
                'You’ll need to use two different branch names to get a valid comparison.'
              ) : (
                <>
                  <b>{toBranch.name}</b> is up to date with <b>{fromBranch.name}</b>. Try switching the base for your
                  comparison.
                </>
              )}
            </p>
          </div>
        )}
      </Segment>
    );
  }
}

CompareChanges.propTypes = {
  userId: PropTypes.string.isRequired,
  repositoryId: PropTypes.string.isRequired,
  branches: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.object.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id: repositoryId, branches }
    }
  },
  profile: {
    currentUser: { id: userId }
  }
}) => ({
  userId,
  repositoryId,
  branches
});

export default connect(mapStateToProps)(CompareChanges);
