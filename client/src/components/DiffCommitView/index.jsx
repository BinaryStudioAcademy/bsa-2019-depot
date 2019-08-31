import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { CommitCommentItem } from '../CommitCommentItem';
import { Container, Grid, Form, Button, Message, Item, Loader } from 'semantic-ui-react';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { connect } from 'react-redux';
import * as commitsService from '../../services/commitsService';
import DiffList from '../DiffList';
import { getUserImgLink } from '../../helpers/imageHelper';
import { socketInit } from '../../helpers/socketInitHelper';

import './styles.module.scss';

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
      }
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
      ...this.state,
      loading
    });
  }

  async setError(error) {
    await this.setState({
      ...this.state,
      error
    });
  }

  async fetchDiffs() {
    try {
      await this.setLoading(true);
      const { username, reponame, hash } = this.props.match.params;
      const diffsData = await commitsService.getCommitDiffs(username, reponame, hash);
      this.setState({
        ...this.state,
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
        ...this.state,
        comments
      });
    } catch (err) {
      await this.setError(err);
    } finally {
      await this.setLoading(false);
    }
  }

  async componentDidMount() {
    await this.fetchDiffs();
    const { id } = this.state.diffsData;
    if (id) {
      await this.fetchComments(id);
    }
    this.initSocket();
  }

  onTabChange(selectedTab) {
    this.setState({ ...this.state, selectedTab });
  }

  onBodyChange(body) {
    this.setState({ ...this.state, body });
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

    this.socket.on('newCommitComment', data => {
      this.setState({
        ...this.state,
        comments: [...this.state.comments, data]
      });
    });
  }

  async onSubmit() {
    const { body } = this.state;
    const { username, reponame, hash } = this.props.match.params;
    await commitsService.addCommitComment({
      username,
      reponame,
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
          ...this.state,
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
      const updatedComment = await commitsService.updateCommitComment({ id, body: text, commitId, userId });
      if (updatedComment) {
        const { id } = updatedComment;
        const { comments } = this.state;
        const commentIdx = comments.findIndex(comment => comment.id === id);
        let updatedComments = [...comments];
        updatedComments.splice(commentIdx, 1, updatedComment);
        await this.setState({
          ...this.state,
          comments: updatedComments
        });
      }
    } catch (err) {
      await this.setError(err);
    }
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  render() {
    const { body, selectedTab, loading, comments, diffsData, error } = this.state;
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
            editComment={this.editComment}
            deleteComment={this.deleteComment}
          />
        ))}
      </Item.Group>
    ) : null;

    return (
      <div>
        {pageError}
        <DiffList diffs={diffsData.diffs}/>
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
      </div>
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
