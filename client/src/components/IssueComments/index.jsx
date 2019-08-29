import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import moment from 'moment';
import { Header, Button, Label, Icon, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getIssueByNumber, getIssueComments } from '../../services/issuesService';
import { createIssueComment, updateIssueComment, deleteIssueComment } from '../../services/issueCommentsService';
import IssueComment from '../IssueComment';
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
      isDisabled: true
    };

    this.onCommentCreate = this.onCommentCreate.bind(this);
    this.onCommentUpdate = this.onCommentUpdate.bind(this);
    this.onCommentDelete = this.onCommentDelete.bind(this);
    this.onIssueUpdate = this.onIssueUpdate.bind(this);
    this.onIssueDelete = this.onIssueDelete.bind(this);
    this.onIssueToggle = this.onIssueToggle.bind(this);
  }

  async componentDidMount() {
    this.initSocket();
    const {
      match: {
        params: { reponame, number }
      }
    } = this.props;
    const currentIssue = await getIssueByNumber(reponame, number);
    const { id } = currentIssue;
    const issueComments = await getIssueComments(id);
    this.setState({
      currentIssue,
      issueComments,
      loading: false
    });
    this.socket.on('newIssueComment', async data => {
      const issueComments = await getIssueComments(data.issueId);
      this.setState({
        issueComments
      });
    });
  }

  initSocket() {
    const { REACT_APP_SOCKET_SERVER, REACT_APP_SOCKET_SERVER_PORT } = process.env;
    const address = `http://${REACT_APP_SOCKET_SERVER}:${REACT_APP_SOCKET_SERVER_PORT}`;
    this.socket = io(address);
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

  async onIssueUpdate(id, comment) {
    console.warn('Issue updated!', { id, comment });
  }

  async onIssueDelete() {
    const { id } = this.state.currentIssue;
    console.warn('Issue deleted!', id);
  }

  async onIssueToggle(i) {
    const { id } = this.state.currentIssue;
    console.warn('Issue closed/reopened!', id);
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

  render() {
    const { currentIssue, issueComments, loading } = this.state;
    const {
      match: { url },
      userImg,
      userName
    } = this.props;
    const newIssueUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');

    return loading ? (
      <Loader active />
    ) : (
      <>
        <div className={styles.header_row}>
          <Header as="h2">
            {currentIssue.title}
            <span>{` #${currentIssue.number}`}</span>
          </Header>
          <Link to={`${newIssueUrl}/new`}>
            <Button compact positive content="New Issue" primary />
          </Link>
        </div>
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
          onSubmit={this.onIssueUpdate}
          submitBtnTxt="Update comment"
          cancelBtnTxt="Cancel"
        />

        {issueComments.length > 0 &&
          issueComments.map(issueComment => (
            <IssueComment
              key={issueComment.id}
              id={issueComment.id}
              avatar={currentIssue.user.avatar}
              username={issueComment.user.username}
              body={issueComment.body}
              createdAt={issueComment.createdAt}
              newComment={false}
              onSubmit={this.onCommentUpdate}
              submitBtnTxt="Update comment"
              cancelBtnTxt="Cancel"
              onDelete={this.onCommentDelete}
            />
          ))}
        <IssueComment
          avatar={currentIssue.user.avatar}
          username={userName}
          newComment={true}
          onSubmit={this.onCommentCreate}
          submitBtnTxt="Comment"
          createdAt={currentIssue.createdAt}
          buttons={[
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
          ]}
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
  userName: PropTypes.string.isRequired
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
