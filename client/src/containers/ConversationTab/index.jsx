import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Grid, Segment, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import IssuePrSidebar from '../IssuePrSidebar';
import Comment from '../../components/Comment';

import { socketInit } from '../../helpers/socketInitHelper';

import {
  getPullByNumber,
  getPullComments,
  updatePull,
  closePull,
  reopenPull,
  mergePull
} from '../../services/pullsService';
import { updatePullComment, createPullComment, deletePullComment } from '../../services/pullCommentsService';
import * as LabelService from '../../services/labelsService';
import * as PullReviewerService from '../../services/pullReviewersService';

import styles from './styles.module.scss';

class ConversationTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      collaborators: null,
      reviewers: null,
      pullComments: []
    };
  }

  async componentDidMount() {
    const { pullComments } = this.props;
    this.setState({
      pullComments,
      loading: false
    });
    this.initSocket();
  }

  initSocket() {
    this.socket = socketInit('pulls');
    const {
      currentPull: { id }
    } = this.props;
    this.socket.emit('createRoom', id);

    this.socket.on('newPullComment', data => {
      const { pullComments } = this.state;
      pullComments.data.push(data);
      this.setState({
        pullComments
      });
    });

    this.socket.on('changedPullComments', async () => {
      const { currentPull, updateState } = this.props;
      const pullComments = await getPullComments(currentPull.id);
      updateState({ pullComments });
    });

    this.socket.on('changedPull', async () => {
      const {
        match: {
          params: { username, reponame, number }
        },
        updateState
      } = this.props;
      const currentPull = await getPullByNumber(username, reponame, number);
      updateState({ currentPull });
    });
  }

  generateButtons = status => {
    const buttons = [];
    switch (status) {
    case 'OPEN':
      buttons.push(
        <Button compact floated="right" color="grey" key="close" onClick={this.onClosePull}>
            Close pull-request
        </Button>,
        <Button compact floated="right" secondary key="merge" onClick={this.onMergePull}>
          <Icon name="check circle outline" />
            Merge pull-request
        </Button>
      );
      break;
    case 'CLOSED':
      buttons.push(
        <Button compact floated="right" secondary color="red" key="close" onClick={this.onReopenPull}>
            Reopen pull-request
        </Button>
      );
      break;
    default:
      break;
    }
    return buttons;
  };

  onPullUpdateBody = async (id, body) => {
    const { title } = this.props.currentPull;
    return await updatePull({ id, title, body });
  };

  onCommentUpdate = async (id, comment) => {
    return updatePullComment({ id, comment });
  };

  onCommentCreate = async (id, comment) => {
    this.setState({
      isDisabled: true
    });
    const {
      currentPull: { id: pullId, title },
      match: {
        params: { username }
      }
    } = this.props;

    if (!comment) return;

    const { userId } = this.props;
    await createPullComment({
      comment,
      pullId,
      userId,
      username,
      title
    });
  };

  onCommentDelete = id => {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }

    return deletePullComment(id);
  };

  onClosePull = async () => {
    const {
      match: {
        params: { username, reponame, number }
      },
      currentPull: { id },
      updateState
    } = this.props;
    const result = await closePull({ id });
    if (result) {
      const currentPull = await getPullByNumber(username, reponame, number);
      updateState({
        currentPull
      });
    }
  };

  onReopenPull = async () => {
    const {
      match: {
        params: { username, reponame, number }
      },
      currentPull: { id },
      updateState
    } = this.props;
    const result = await reopenPull({ id });
    if (result) {
      const currentPull = await getPullByNumber(username, reponame, number);
      updateState({
        currentPull
      });
    }
  };

  onMergePull = async () => {
    const {
      match: {
        params: { username, reponame, number }
      },
      currentPull: { id },
      updateState
    } = this.props;
    const result = await mergePull({ id });
    if (result) {
      const currentPull = await getPullByNumber(username, reponame, number);
      updateState({
        currentPull
      });
    }
  };

  setLabelsToPull = async labelIds => {
    const {
      currentPull: { id: pullId, repositoryId }
    } = this.props;
    return LabelService.setLabelsToPull(labelIds, pullId, repositoryId);
  };

  setReviewerToPull = async userId => {
    const {
      currentPull: { id: pullId }
    } = this.props;
    return PullReviewerService.addReviewer({ userId, pullId });
  };

  removeReviewerFromPull = async reviewerId => {
    return PullReviewerService.removeReviewer(reviewerId);
  };

  render() {
    const {
      userId,
      username,
      userImg,
      currentPull,
      isOwnPull,
      labels,
      currentLabels,
      reviewers,
      collaborators
    } = this.props;
    const { pullComments, loading } = this.state;
    const {
      user: { imgUrl, username: owner },
      body,
      id,
      prstatus,
      createdAt
    } = currentPull;
    const { data: comments } = pullComments;
    return !loading ? (
      <Segment className={styles.noBorder}>
        <Grid>
          <Grid.Column width={12}>
            <Comment
              id={id}
              avatar={imgUrl}
              username={owner}
              body={body}
              createdAt={createdAt}
              newComment={false}
              onSubmit={this.onPullUpdateBody}
              submitBtnTxt="Update comment"
              cancelBtnTxt="Cancel"
              ownComment={isOwnPull}
              isQuestion={false}
            />
            {comments.length > 0 &&
              comments.map((comment, index) => {
                const {
                  id,
                  user: { username, imgUrl },
                  body,
                  createdAt,
                  userId: commentUserId
                } = comment;
                return (
                  <Comment
                    key={index}
                    id={id}
                    avatar={imgUrl}
                    username={username}
                    body={body}
                    createdAt={createdAt}
                    newComment={false}
                    onSubmit={this.onCommentUpdate}
                    submitBtnTxt="Update comment"
                    cancelBtnTxt="Cancel"
                    onDelete={this.onCommentDelete}
                    ownComment={userId === commentUserId}
                    isQuestion={false}
                  />
                );
              })}
            <Comment
              avatar={userImg}
              username={username}
              newComment={true}
              onSubmit={this.onCommentCreate}
              submitBtnTxt="Comment"
              createdAt={createdAt}
              buttons={isOwnPull ? this.generateButtons(prstatus.name) : null}
              isQuestion={false}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <IssuePrSidebar
              isIssue={false}
              labels={labels}
              currentLabels={currentLabels}
              setLabels={this.setLabelsToPull}
              reviewers={reviewers}
              collaborators={collaborators}
              setReviewerToPull={this.setReviewerToPull}
              removeReviewerFromPull={this.removeReviewerFromPull}
            />
          </Grid.Column>
        </Grid>
      </Segment>
    ) : (
      <Loader active />
    );
  }
}

ConversationTab.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  userId: PropTypes.string,
  username: PropTypes.string,
  userImg: PropTypes.string,
  currentPull: PropTypes.object,
  pullComments: PropTypes.object,
  isOwnPull: PropTypes.bool,
  updateState: PropTypes.func,
  labels: PropTypes.array.isRequired,
  currentLabels: PropTypes.array.isRequired,
  reviewers: PropTypes.array.isRequired,
  collaborators: PropTypes.array.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId, username, imgUrl }
  }
}) => ({
  userId,
  username,
  userImg: imgUrl
});

export default connect(mapStateToProps)(withRouter(ConversationTab));
