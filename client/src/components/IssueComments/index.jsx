import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Label, Icon, Loader } from 'semantic-ui-react';
import {
  getIssueByNumber,
  getIssueComments,
  updateIssue,
  closeIssue,
  reopenIssue,
  deleteIssue
} from '../../services/issuesService';
import { createIssueComment, updateIssueComment, deleteIssueComment } from '../../services/issueCommentsService';
import IssueComment from '../IssueComment';
import IssueHeader from '../IssueHeader';
import { socketInit } from '../../helpers/socketInitHelper';
import { getUserPermissions } from '../../helpers/checkPermissionsHelper';
import 'react-mde/lib/styles/css/react-mde-all.css';

import styles from './styles.module.scss';

class IssueComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIssue: {},
      issueComments: [],
      loading: true,
      comment: '',
      selectedTab: 'write',
      isDisabled: true,
      isOwnIssue: false,
      issuesBaseUrl: this.props.match.url.replace(/\/[^/]+$/, ''),
      isAccessGranted: false
    };

    this.onCommentCreate = this.onCommentCreate.bind(this);
    this.onCommentUpdate = this.onCommentUpdate.bind(this);
    this.onCommentDelete = this.onCommentDelete.bind(this);
    this.onIssueUpdateBody = this.onIssueUpdateBody.bind(this);
    this.onIssueUpdateTitle = this.onIssueUpdateTitle.bind(this);
    this.onIssueDelete = this.onIssueDelete.bind(this);
    this.onIssueToggle = this.onIssueToggle.bind(this);
    this.redirectToCreateNewIssue = this.redirectToCreateNewIssue.bind(this);
  }

  async componentDidMount() {
    const {
      userId,
      match: {
        params: { username, reponame, number }
      }
    } = this.props;
    console.warn(this.props.match.params);

    const currentIssue = await getIssueByNumber(username, reponame, number);
    const { id } = currentIssue;

    const issueComments = await getIssueComments(id);

    const isAccessGranted = await getUserPermissions(username, reponame, userId);

    this.setState({
      currentIssue,
      issueComments,
      isAccessGranted,
      loading: false
    });
    this.initSocket();
  }

  componentWillUnmount() {
    const {
      currentIssue: { id }
    } = this.state;
    this.socket.emit('leaveRoom', id);
  }

  initSocket() {
    this.socket = socketInit('issues');
    const {
      currentIssue: { id }
    } = this.state;

    this.socket.emit('createRoom', id);

    this.socket.on('newIssueComment', data => {
      this.setState({
        ...this.state,
        issueComments: [...this.state.issueComments, data]
      });
    });
  }

  async onCommentUpdate(id, comment) {
    const result = updateIssueComment({ id, comment });

    if (result) {
      const issueComments = await getIssueComments(this.state.currentIssue.id);
      this.setState({
        comment: '',
        issueComments
      });
      return result;
    }
  }

  async onCommentDelete(id) {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }

    const result = await deleteIssueComment({ id });

    if (result) {
      const issueComments = await getIssueComments(this.state.currentIssue.id);
      this.setState({
        ...this.state,
        issueComments
      });
      return result;
    }
  }

  async onIssueUpdateBody(id, body) {
    const { title } = this.state.currentIssue;
    return await updateIssue({ id, title, body });
  }

  async onIssueUpdateTitle(title) {
    const { id, body } = this.state.currentIssue;
    return await updateIssue({ id, title, body });
  }

  async onIssueDelete() {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }

    const { id } = this.state.currentIssue;
    const result = await deleteIssue({ id });
    if (result) {
      this.props.history.push(this.state.issuesBaseUrl);
    }
  }

  async onIssueToggle() {
    const { id, isOpened } = this.state.currentIssue;
    const result = isOpened ? await closeIssue({ id }) : await reopenIssue({ id });
    if (result) {
      this.setState({
        ...this.state,
        currentIssue: {
          ...this.state.currentIssue,
          isOpened: !this.state.currentIssue.isOpened
        }
      });
    }
  }

  async onCommentCreate(id, comment) {
    this.setState({
      isDisabled: true
    });
    const {
      currentIssue: { id: issueId }
    } = this.state;

    if (!comment) return;

    const { userId } = this.props;
    const result = await createIssueComment({
      comment,
      issueId,
      userId
    });

    if (result) {
      this.socket.emit('newIssueComment', {
        issueId
      });

      const issueComments = await getIssueComments(issueId);
      this.setState({
        comment: '',
        issueComments
      });

      return result;
    }
  }

  isOwnIssue() {
    const { userId } = this.props;
    const {
      isAccessGranted,
      currentIssue: { userId: issueUserId }
    } = this.state;
    return userId === issueUserId || isAccessGranted;
  }

  redirectToCreateNewIssue() {
    this.props.history.push(this.state.issuesBaseUrl + '/new');
  }

  render() {
    const { currentIssue, issueComments, loading } = this.state;
    const { userImg, userName, userId } = this.props;

    return loading ? (
      <Loader active />
    ) : (
      <>
        <IssueHeader
          title={currentIssue.title}
          number={currentIssue.number}
          canEdit={this.isOwnIssue()}
          onNewIssue={this.redirectToCreateNewIssue}
          onSubmit={this.onIssueUpdateTitle}
        />
        <div>
          <Label color={currentIssue.isOpened ? 'green' : 'red'} className={styles.issue_label}>
            <Icon name="exclamation circle" /> {currentIssue.isOpened ? 'Open' : 'Closed'}
          </Label>
          <span className={styles.comment_author_name}>
            {`${currentIssue.user.username} `}
            <span>{`opened this issue ${moment(currentIssue.createdAt).fromNow()} · ${
              issueComments.length
            } comments`}</span>
          </span>
        </div>
        <IssueComment
          id={currentIssue.id}
          avatar={userImg}
          username={currentIssue.user.username}
          body={currentIssue.body}
          createdAt={currentIssue.createdAt}
          newComment={false}
          onSubmit={this.onIssueUpdateBody}
          submitBtnTxt="Update comment"
          cancelBtnTxt="Cancel"
          ownComment={this.isOwnIssue()}
        />

        {issueComments.length > 0 &&
          issueComments.map(issueComment => {
            const {
              id,
              user: { username },
              body,
              createdAt,
              userId: commentUserId
            } = issueComment;

            return (
              <IssueComment
                key={id}
                id={id}
                avatar={currentIssue.user.avatar}
                username={username}
                body={body}
                createdAt={createdAt}
                newComment={false}
                onSubmit={this.onCommentUpdate}
                submitBtnTxt="Update comment"
                cancelBtnTxt="Cancel"
                onDelete={this.onCommentDelete}
                ownComment={userId === commentUserId}
              />
            );
          })}
        <IssueComment
          avatar={currentIssue.user.avatar}
          username={userName}
          newComment={true}
          onSubmit={this.onCommentCreate}
          submitBtnTxt="Comment"
          createdAt={currentIssue.createdAt}
          buttons={
            this.isOwnIssue()
              ? [
                currentIssue.isOpened ? (
                  <Button compact floated="right" secondary key="close" onClick={this.onIssueToggle}>
                    <Icon name="check circle outline" />
                      Close issue
                  </Button>
                ) : (
                  <Button compact floated="right" secondary color="red" key="close" onClick={this.onIssueToggle}>
                      Reopen issue
                  </Button>
                ),
                <Button compact floated="right" basic color="grey" key="delete" onClick={this.onIssueDelete}>
                  <Icon name="exclamation" color="grey" />
                    Delete issue
                </Button>
              ]
              : null
          }
        />
      </>
    );
  }
}

IssueComments.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  userId: PropTypes.string.isRequired,
  userImg: PropTypes.string,
  userName: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id, imgUrl, username }
  }
}) => ({
  userId: id,
  userImg: imgUrl,
  userName: username
});

export default connect(mapStateToProps)(IssueComments);
