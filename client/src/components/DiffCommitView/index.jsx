import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { CommitCommentItem } from '../CommitCommentItem';
import { Container, Grid, Form, Button, Message, Item } from 'semantic-ui-react';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { connect } from 'react-redux';
import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';
import * as commitsService from '../../services/commitsService';
import { fetchDiffs } from '../../routines/routines';
import { getUserImgLink } from '../../helpers/imageHelper';

import './styles.module.scss';

//Mock
const commentsMock = [
  {
    id: '0de03bf7-f7c9-4eb8-81c0-5dd7ea0ad877',
    commitId: '9a075176-6aae-43f9-aaa0-921260b0d67d',
    author: {
      id: '6c17cce4-dbfa-426d-8ea6-2c2f6d44e64f',
      username: 'Olya',
      name: null,
      imgUrl: null
    },
    body: '**Oh! That`s great!**',
    createdAt: '2019-08-20T04:28:16.599Z',
    updatedAt: '2019-08-20T04:28:16.599Z'
  },
  {
    id: '0de03bf7-f7c9-4eb8-81c0-5dd7ea0ad855',
    commitId: '9a075176-6aae-43f9-aaa0-921260b0d67d',
    author: {
      id: '51304694-a311-4a54-b244-d6fbe3a8044a',
      username: 'test',
      name: null,
      imgUrl: 'https://i.pravatar.cc/300?img=5'
    },
    body: 'Hello!!!!',
    createdAt: '2019-08-21T04:28:16.599Z',
    updatedAt: '2019-08-21T04:28:16.599Z'
  }
];

class DiffCommitView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      selectedTab: 'write',
      comments: [],
      error: ''
    };

    this.onBodyChange = this.onBodyChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount() {
    this.props.fetchDiffs({
      owner: this.props.match.params.username,
      repoName: this.props.match.params.reponame,
      hash: this.props.match.params.hash
    });
    // this.props.fetchComments({
    // });
  }

  onTabChange(selectedTab) {
    this.setState({ ...this.state, selectedTab });
  }

  onBodyChange(body) {
    this.setState({ ...this.state, body });
  }

  onSubmit({ body }) {
    const {
      match: {
        params: { hash, reponame }
      },
      currentUser: { username }
    } = this.props;
    commitsService
      .addCommitComment({ sha: hash, username, reponame, body })
      .then(newComment => this.setState({ comments: { ...this.state.comments, newComment } }));
  }

  deleteComment(id) {
    // need to revert when server side will work
    //commitsService.deleteCommitComment(id).then(() =>
    console.warn(id);
    this.setState(({ comments }) => ({
      comments: comments.filter(comment => comment.id !== id)
    }));
    //);
  }

  editComment(id, body) {
    let { comments } = this.state;
    comments.map(comment => {
      if (comment.id === id) {
        comment.body = body;
      }
      return comment;
    });
    commitsService.updateCommitComment({ id, body }).then(newComment => this.setState({ comments }));
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  render() {
    const { body, selectedTab } = this.state;
    const { diffsData, match, currentUser } = this.props;
    let files = [];

    if (diffsData.diffs) {
      files = parseDiff(diffsData.diffs);
    }

    const error = diffsData.error ? <div>{diffsData.error}</div> : null;

    const comments = commentsMock ? (
      <Item.Group className="commit-comments-list">
        {commentsMock.map(comment => (
          <CommitCommentItem
            comment={comment}
            id={comment.id}
            key={comment.id}
            authorId={comment.author.id}
            author={comment.author.name ? comment.author.name : comment.author.username}
            body={comment.body}
            avatar={comment.author.imgUrl}
            hash={match.params.hash}
            commitId={comment.commitId}
            userId={currentUser.id}
            editComment={this.editComment}
            deleteComment={this.deleteComment}
          />
        ))}
      </Item.Group>
    ) : null;

    const renderHunk = (newPath, hunk) => [
      <Decoration key={hunk.content} className="diff-filename">
        {newPath}
      </Decoration>,
      <Decoration key={`decoration-${hunk.content}`}>{hunk.content}</Decoration>,
      <Hunk key={hunk.content + Math.random()} hunk={hunk} />
    ];
    const renderFile = ({ newPath, oldRevision, newRevision, type, hunks }) =>
      type === 'new' ? (
        <div key={newPath} className="diff-content">
          <p className="diff-filename">{`new empty file ${newPath}`}</p>
        </div>
      ) : (
        <Diff
          key={`${oldRevision}-${newRevision}`}
          viewType="unified"
          diffType={type}
          hunks={hunks}
          className="diff-content"
        >
          {hunks => hunks.flatMap(h => renderHunk(newPath, h))}
        </Diff>
      );

    return (
      <div>
        {error}
        {files.map(renderFile)}
        <div className="comments-count">
          {`${commentsMock ? commentsMock.length : 0} comments on commit`}{' '}
          <Message compact>{match.params.hash.slice(0, 7)}</Message>
        </div>
        {comments}
        <Container className="commit-comment-form">
          <Form onSubmit={this.onSubmit}>
            <Grid>
              <Grid.Column width={1}>
                <Item.Image
                  size="tiny"
                  src={
                    currentUser.imgUrl
                      ? getUserImgLink(currentUser.imgUrl)
                      : 'https://forwardsummit.ca/wp-content/uploads/2019/01/avatar-default.png'
                  }
                />
              </Grid.Column>
              <Grid.Column width={15}>
                <ReactMde
                  value={body}
                  onChange={this.onBodyChange}
                  selectedTab={selectedTab}
                  onTabChange={this.onTabChange}
                  generateMarkdownPreview={this.renderPreview}
                />
                <Button color="blue" floated="right" type="submit">
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
  diffsData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    diffs: PropTypes.string
  }).isRequired,
  fetchDiffs: PropTypes.func.isRequired,
  match: PropTypes.object,
  currentUser: PropTypes.object
};

const mapStateToProps = ({ diffsData, profile: { currentUser } }) => ({
  diffsData,
  currentUser
});

const mapDispatchToProps = {
  fetchDiffs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiffCommitView);
