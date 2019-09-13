import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CheckCircleFill } from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-react';
import { Button, Label, Icon, Loader, Segment, Grid } from 'semantic-ui-react';
import {
  getIssueByNumber,
  getIssueComments,
  updateIssue,
  closeIssue,
  reopenIssue,
  deleteIssue,
  getAvailableAssignees,
  setAssigneesToIssue
} from '../../services/issuesService';
import { getLabels, setLabelsToIssue } from '../../services/labelsService';
import { createIssueComment, updateIssueComment, deleteIssueComment } from '../../services/issueCommentsService';
import Comment from '../Comment';
import IssuePrHeader from '../IssuePrHeader';
import IssuePrSidebar from '../../containers/IssuePrSidebar';
import { getAllQuestionOnSO } from '../../services/issuesService';
import { socketInit } from '../../helpers/socketInitHelper';
import { getWriteUserPermissions } from '../../helpers/checkPermissionsHelper';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { fetchCurrentRepo } from '../../routines/routines';

import styles from './styles.module.scss';

import { ReactComponent as SOLogoSVG } from '../../styles/assets/icons/stackoverflow.svg';
import SOAvatarSVG from '../../styles/assets/icons/so-logo.svg';
AntdIcon.add(CheckCircleFill);

const REACT_APP_STACK_OVERFLOW_API_KEY = process.env.REACT_APP_STACK_OVERFLOW_API_KEY;

class IssueComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIssue: {},
      issueComments: [],
      questions: [],
      loading: true,
      comment: '',
      selectedTab: 'write',
      isDisabled: true,
      isOwnIssue: false,
      issuesBaseUrl: this.props.match.url.replace(/\/[^/]+$/, ''),
      isAccessGranted: false,
      labels: [],
      currentLabels: []
    };

    this.onCommentCreate = this.onCommentCreate.bind(this);
    this.onCommentUpdate = this.onCommentUpdate.bind(this);
    this.onCommentDelete = this.onCommentDelete.bind(this);
    this.onIssueUpdateBody = this.onIssueUpdateBody.bind(this);
    this.onIssueUpdateTitle = this.onIssueUpdateTitle.bind(this);
    this.onIssueDelete = this.onIssueDelete.bind(this);
    this.onIssueToggle = this.onIssueToggle.bind(this);
    this.redirectToCreateNewIssue = this.redirectToCreateNewIssue.bind(this);
    this.setLabelsToIssue = this.setLabelsToIssue.bind(this);
    this.setAssigneesToIssue = this.setAssigneesToIssue.bind(this);
  }

  async componentDidMount() {
    const {
      userId,
      repositoryId,
      match: {
        params: { username, reponame, number }
      }
    } = this.props;
    const currentIssue = await getIssueByNumber(username, reponame, number);
    const { id, title } = currentIssue;

    const issueComments = await getIssueComments(id);

    const labels = await getLabels(repositoryId);
    const { issueLabels: currentLabels } = currentIssue;

    const assignees = await getAvailableAssignees(id);
    const currentAssignees = currentIssue.issueAssignees.map(issueAssignee => issueAssignee.assignee);

    const isAccessGranted = await getWriteUserPermissions(username, reponame, userId);

    const filter = {
      key: REACT_APP_STACK_OVERFLOW_API_KEY,
      intitle: title,
      site: 'stackoverflow',
      pagesize: 5,
      // tagged: ['reactjs', 'javascript'].join(';'), // for label names
      sort: 'votes',
      order: 'desc'
    };
    const soQuestions = await getAllQuestionOnSO(filter);

    this.setState({
      currentIssue,
      issueComments,
      isAccessGranted,
      questions: soQuestions,
      labels,
      currentLabels,
      assignees,
      currentAssignees,
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
        issueComments: [...this.state.issueComments, data]
      });
    });

    this.socket.on('changedIssueComments', async () => {
      const issueComments = await getIssueComments(this.state.currentIssue.id);
      this.setState({ issueComments });
    });

    this.socket.on('changedIssue', async () => {
      // const currentIssue = await getIssueByNumber(username, reponame, number);
      // this.setState({ currentIssue });
    });
  }

  async onCommentUpdate(id, comment) {
    return updateIssueComment({ id, comment });
  }

  async onCommentDelete(id) {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }

    return await deleteIssueComment(id);
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
    const { owner, reponame, fetchCurrentRepo } = this.props;
    const result = await deleteIssue({ id });
    if (result) {
      fetchCurrentRepo({ username: owner, reponame });
      this.props.history.push(this.state.issuesBaseUrl);
    }
  }

  async onIssueToggle() {
    const { id, isOpened } = this.state.currentIssue;
    const result = isOpened ? await closeIssue({ id }) : await reopenIssue({ id });
    if (result) {
      this.setState({
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
      currentIssue: { id: issueId, title }
    } = this.state;
    if (!comment) return;
    const {
      userId,
      match: {
        params: { username }
      }
    } = this.props;

    const result = await createIssueComment({
      comment,
      issueId,
      userId,
      username,
      title
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
    const { userId, userName, match } = this.props;
    const { username } = match.params;
    const {
      isAccessGranted,
      currentIssue: { userId: issueUserId }
    } = this.state;
    return username === userName || userId === issueUserId || isAccessGranted;
  }

  redirectToCreateNewIssue() {
    this.props.history.push(this.state.issuesBaseUrl + '/new');
  }

  async setLabelsToIssue(labelIds) {
    const {
      currentIssue: { id: issueId }
    } = this.state;
    return setLabelsToIssue(labelIds, issueId);
  }

  async setAssigneesToIssue(assigneeIds) {
    const {
      currentIssue: { id: issueId }
    } = this.state;
    return setAssigneesToIssue(assigneeIds, issueId);
  }

  render() {
    const {
      currentIssue,
      issueComments,
      loading,
      questions,
      labels,
      currentLabels,
      assignees,
      currentAssignees
    } = this.state;
    const { userImg, userName, userId } = this.props;

    return loading || questions.length ? (
      <Loader active />
    ) : (
      <Segment basic>
        <IssuePrHeader
          title={currentIssue.title}
          number={currentIssue.number}
          canEdit={this.isOwnIssue()}
          onNewIssue={this.redirectToCreateNewIssue}
          onSubmit={this.onIssueUpdateTitle}
          isIssue={true}
        />

        <div className={styles.status_line}>
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
        <Grid>
          <Grid.Column width={12}>
            <Comment
              id={currentIssue.id}
              avatar={currentIssue.user.imgUrl}
              username={currentIssue.user.username}
              body={currentIssue.body}
              createdAt={currentIssue.createdAt}
              newComment={false}
              onSubmit={this.onIssueUpdateBody}
              submitBtnTxt="Update comment"
              cancelBtnTxt="Cancel"
              ownComment={this.isOwnIssue()}
            />

            {questions.items && questions.items.length && currentIssue.isOpened ? (
              <>
                <h2 className={styles.questionsHeader}>
                  <span>Related questions from </span>
                  <SOLogoSVG className={styles.SOIcon} />
                </h2>
                {questions.items.map((question, index) => (
                  <Comment key={index} avatar={SOAvatarSVG} isQuestion question={question} />
                ))}
              </>
            ) : null}

            {issueComments.length > 0 &&
              issueComments.map(issueComment => {
                const {
                  id,
                  user: { username, imgUrl },
                  body,
                  createdAt,
                  userId: commentUserId
                } = issueComment;
                return (
                  <Comment
                    key={id}
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
                  />
                );
              })}
            <Comment
              avatar={userImg}
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
          </Grid.Column>
          <Grid.Column width={4}>
            <IssuePrSidebar
              isIssue={true}
              labels={labels}
              currentLabels={currentLabels}
              setLabels={this.setLabelsToIssue}
              assignees={assignees}
              currentAssignees={currentAssignees}
              setAssignees={this.setAssigneesToIssue}
            />
          </Grid.Column>
        </Grid>
      </Segment>
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
  repositoryId: PropTypes.string.isRequired,
  userImg: PropTypes.string,
  userName: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id, imgUrl, username }
  },
  currentRepo: {
    repository: {
      currentRepoInfo: {
        id: repositoryId,
        name: reponame,
        user: { username: owner }
      }
    }
  }
}) => ({
  userId: id,
  userImg: imgUrl,
  userName: username,
  repositoryId,
  reponame,
  owner
});

const mapDispatchToProps = {
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueComments);
