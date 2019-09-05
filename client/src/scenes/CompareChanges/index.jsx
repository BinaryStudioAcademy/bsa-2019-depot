import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Item, Loader, Segment } from 'semantic-ui-react';
import Octicon, { Comment, Diff, GitCommit, Organization } from '@primer/octicons-react';
import SelectCompareBranches from '../../components/SelectCompareBranches';
import CommitList from '../../components/CommitsList';
import { CommitCommentItem } from '../../components/CommitCommentItem';
import DiffList from '../../components/DiffList';
import CreateIssuePrForm from '../../components/CreateIssuePrForm';
import { getBranchDiffs } from '../../services/pullsService';
import { createPull } from '../../services/pullsService';

import styles from './styles.module.scss';

class CompareChanges extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fromBranch: this.props.branches[0].name,
      toBranch: this.props.branches[0].name,
      diffs: null,
      commits: null,
      commitComments: null,
      numOfCommits: 0,
      numOfFiles: 0,
      numOfCommitComments: 0,
      numOfContributors: 0
    };

    this.onToBranchChange = this.onToBranchChange.bind(this);
    this.onFromBranchChange = this.onFromBranchChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.updateBranchDiffs();
  }

  updateBranchDiffs() {
    const { repositoryId } = this.props;
    const { fromBranch, toBranch } = this.state;

    this.setState({ loading: true });
    getBranchDiffs(repositoryId, { fromBranch, toBranch }).then(({ diffs, commits }) => {
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
    });
  }

  onToBranchChange(event, { value }) {
    this.setState({ toBranch: value }, () => {
      this.updateBranchDiffs();
    });
  }

  onFromBranchChange(event, { value }) {
    this.setState({ fromBranch: value }, () => {
      this.updateBranchDiffs();
    });
  }

  onSubmit(title, body) {
    const { userId, repositoryId, branches, history, match } = this.props;
    const { username, reponame } = match.params;
    const { fromBranch, toBranch } = this.state;

    const { id: fromBranchId, headCommitId: fromCommitId } = branches.find(({ name }) => name === fromBranch);
    const { id: toBranchId, headCommitId: toCommitId } = branches.find(({ name }) => name === toBranch);

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
    createPull(request).then(() => {
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
      loading
    } = this.state;
    const { branches } = this.props;

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
          fromBranch={fromBranch}
          toBranch={toBranch}
          branches={branches.map(({ name }) => name)}
          onToBranchChange={this.onToBranchChange}
          onFromBranchChange={this.onFromBranchChange}
        />
        {loading ? (
          <Loader active />
        ) : diffs && diffs.length && commits && commits.length ? (
          <>
            <CreateIssuePrForm isIssues={false} onSubmit={this.onSubmit} />
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
              {fromBranch === toBranch ? (
                'You’ll need to use two different branch names to get a valid comparison.'
              ) : (
                <>
                  <b>{toBranch}</b> is up to date with <b>{fromBranch}</b>. Try switching the base for your comparison.
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
  }).isRequired
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
