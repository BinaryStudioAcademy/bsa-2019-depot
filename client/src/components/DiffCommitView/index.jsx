import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { CommitCommentItem } from '../CommitCommentItem';
import { Container, Grid, Form, Button, Message, Item, Loader, Segment } from 'semantic-ui-react';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { connect } from 'react-redux';
import * as commitsService from '../../services/commitsService';
import DiffList from '../DiffList';
import { getWriteUserPermissions } from '../../helpers/checkPermissionsHelper';
import { getUserImgLink } from '../../helpers/imageHelper';
import { socketInit } from '../../helpers/socketInitHelper';

import styles from './styles.module.scss';

class DiffCommitView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      error: '',
      loading: false,
      selectedTab: 'write',
      comments: [],
      diffsData: {
        id: null,
        diffs: ''
      },
      isAccessGranted: false
    };

    this.onBodyChange = this.onBodyChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async setLoading(loading) {
    await this.setState({
      loading
    });
  }

  async setError(error) {
    await this.setState({
      error
    });
  }

  async fetchDiffs() {
    try {
      await this.setLoading(true);
      const { username, reponame, hash } = this.props.match.params;
      const diffsData = await commitsService.getCommitDiffs(username, reponame, hash);
      this.setState({
        diffsData
      });
    } catch (err) {
      await this.setError(err);
    } finally {
      await this.setLoading(false);
    }
  }

  async fetchComments(id) {
    try {
      await this.setLoading(true);
      const comments = await commitsService.getCommitComments(id);
      this.setState({
        comments
      });
    } catch (err) {
      await this.setError(err);
    } finally {
      await this.setLoading(false);
    }
  }

  async componentDidMount() {
    const {
      currentUser: { id: userId },
      match: {
        params: { username, reponame }
      }
    } = this.props;
    await this.fetchDiffs();
    const { id } = this.state.diffsData;
    if (id) {
      await this.fetchComments(id);
    }
    this.initSocket();

    const isAccessGranted = await getWriteUserPermissions(username, reponame, userId);
    this.setState({
      isAccessGranted
    });
  }

  onTabChange(selectedTab) {
    this.setState({ selectedTab });
  }

  onBodyChange(body) {
    this.setState({ body });
  }

  componentWillUnmount() {
    const {
      diffsData: { id }
    } = this.state;
    this.socket.emit('leaveRoom', id);
  }

  initSocket() {
    this.socket = socketInit('commits');
    const {
      diffsData: { id }
    } = this.state;

    this.socket.emit('createRoom', id);

    this.socket.on('newCommitComment', async data => {
      const {
        diffsData: { id }
      } = this.state;
      const comments = await commitsService.getCommitComments(id);
      this.setState({ comments });
    });

    this.socket.on('changedCommitComment', async () => {
      const {
        diffsData: { id }
      } = this.state;
      const comments = await commitsService.getCommitComments(id);
      this.setState({ comments });
    });
  }

  async onSubmit() {
    const { body } = this.state;
    const { username, reponame, hash } = this.props.match.params;
    const { id: userId } = this.props.currentUser;
    await commitsService.addCommitComment({
      username,
      reponame,
      userId,
      hash,
      body
    });
    this.setState({
      body: ''
    });
  }

  async deleteComment(id) {
    try {
      const { currentUser } = this.props;
      const result = await commitsService.deleteCommitComment(id, currentUser.id);
      if (result) {
        const { comments } = this.state;
        const commentIdx = comments.findIndex(comment => comment.id === id);
        let updatedComments = [...comments];
        updatedComments.splice(commentIdx, 1);
        await this.setState({
          comments: updatedComments
        });
        this.setState(({ comments }) => ({
          comments: comments.filter(comment => comment.id !== id)
        }));
      }
    } catch (err) {
      await this.setError(err);
    }
  }

  async editComment(id, text, commitId, userId) {
    try {
      const result = await commitsService.updateCommitComment({ id, body: text, commitId, userId });
      if (result) {
        const { comments } = this.state;
        const updatedComments = comments.map(comment => (comment.id === id ? { ...comment, body: text } : comment));
        this.setState({ comments: updatedComments });
      }
    } catch (err) {
      await this.setError(err);
    }
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  render() {
    const { body, selectedTab, loading, comments, diffsData, error, isAccessGranted } = this.state;
    if (loading) {
      return <Loader active />;
    }

    const { match, currentUser } = this.props;

    const pageError = error ? <div>{error}</div> : null;

    const commentsList = comments ? (
      <Item.Group className="commit-comments-list">
        {comments.map(comment => (
          <CommitCommentItem
            comment={comment}
            key={comment.id}
            hash={match.params.hash}
            userId={currentUser.id}
            isAccessGranted={isAccessGranted}
            editComment={this.editComment}
            deleteComment={this.deleteComment}
          />
        ))}
      </Item.Group>
    ) : null;

    return (
      <Segment basic>
        {pageError}
        {diffsData.diffs.indexOf('diff --git') !== -1 ? (
          <DiffList diffs={diffsData.diffs} />
        ) : (
          <h3 className={styles.diffInfo}>No diffs for this commit</h3>
        )}
        <div className="comments-count">
          {`${comments ? comments.length : 0} comments on commit`}{' '}
          <Message compact>{match.params.hash.slice(0, 7)}</Message>
        </div>
        {commentsList}
        <Container className="commit-comment-form">
          <Form onSubmit={this.onSubmit}>
            <Grid>
              <Grid.Column width={1}>
                <Item.Image size="tiny" src={getUserImgLink(currentUser.imgUrl)} />
              </Grid.Column>
              <Grid.Column width={15}>
                <ReactMde
                  value={body}
                  onChange={this.onBodyChange}
                  selectedTab={selectedTab}
                  onTabChange={this.onTabChange}
                  generateMarkdownPreview={this.renderPreview}
                />
                <Button color="blue" floated="right" type="submit" disabled={!body}>
                  Comment on this commit
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        </Container>
      </Segment>
    );
  }
}

DiffCommitView.propTypes = {
  match: PropTypes.object,
  currentUser: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(DiffCommitView);
