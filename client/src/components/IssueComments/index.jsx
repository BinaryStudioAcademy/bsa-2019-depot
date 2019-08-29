import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import moment from 'moment';
import { Dropdown, Header, Button, Label, Icon, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getIssueByNumber, getIssueComments, postIssueComment } from '../../services/issuesService';
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

    this.onSubmit = this.onSubmit.bind(this);
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

  async onSubmit() {
    this.setState({
      isDisabled: true
    });
    const {
      comment,
      currentIssue: { id: issueId }
    } = this.state;
    if (!comment) return;
    const { userId } = this.props;
    await postIssueComment({
      comment,
      issueId,
      userId
    });
    this.socket.emit('newIssueComment', {
      issueId
    });
    const issueComments = await getIssueComments(issueId);
    this.setState({
      comment: '',
      issueComments
    });
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
          onSubmit={this.onSubmit}
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
              onSubmit={this.onSubmit}
              submitBtnTxt="Update comment"
              cancelBtnTxt="Cancel"
              dropdowns={[<Dropdown.Item key="delete">Delete</Dropdown.Item>]}
            />
          ))}
        <IssueComment
          avatar={currentIssue.user.avatar}
          username={userName}
          newComment={true}
          onSubmit={this.onSubmit}
          submitBtnTxt="Comment"
          buttons={[
            currentIssue.isOpened ? (
              <Button compact floated="right" secondary key="close">
                <Icon name="check circle outline" />
                Close issue
              </Button>
            ) : (
              <Button compact floated="right" secondary color="red" key="close">
                Reopen issue
              </Button>
            ),
            <Button compact floated="right" basic color="grey" key="delete">
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
  userImg: PropTypes.string.isRequired,
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
