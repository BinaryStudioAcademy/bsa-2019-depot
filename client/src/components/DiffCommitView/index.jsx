import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { InputError } from '../InputError';
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
    id: '1',
    body: 'Oh! That`s great!',
    authorId: '6c17cce4-dbfa-426d-8ea6-2c2f6d44e64f',
    author: {
      username: 'Olya',
      avatar: null
    }
  },
  {
    id: '2',
    body: 'Hello!!!!',
    authorId: '51304694-a311-4a54-b244-d6fbe3a8044a', //You may put your ID here
    author: {
      username: 'Test',
      avatar: 'https://i.pravatar.cc/300?img=5'
    }
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
    commitsService
      .addCommitComment({ body })
      .then(newComment => this.setState({ comments: { ...this.state.comments, newComment } }));
  }

  deleteComment(id) {
    commitsService.deleteCommitComment(id).then(() =>
      this.setState(({ comments }) => ({
        comments: comments.filter(comment => comment.id !== id)
      }))
    );
  }

  editComment({ id, body }) {
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
    const { selectedTab } = this.state;
    const { diffsData, match, currentUser, onSubmit, deleteComment, editComment } = this.props;
    let files = [];

    if (diffsData.diffs) {
      files = parseDiff(diffsData.diffs);
    }

    const error = diffsData.error ? <div>{diffsData.error}</div> : null;
    const validationSchema = Yup.object().shape({
      body: Yup.string()
        .required('Comment message is required')
        .max(200)
    });
    const comments = commentsMock ? (
      <Item.Group className="commit-comments-list">
        {commentsMock.map(comment => (
          <CommitCommentItem
            comment={comment}
            id={comment.id}
            key={comment.id}
            authorId={comment.authorId}
            author={comment.author.username}
            body={comment.body}
            avatar={comment.author.avatar}
            hash={match.params.hash}
            userId={currentUser.id}
            editComment={editComment}
            deleteComment={deleteComment}
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
        <Container>
          <Formik initialValues={{ body: '' }} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values: { body }, errors, isValid, handleChange, handleBlur, handleSubmit }) => (
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
                    <InputError name="body" />
                    <Button color="green" floated="right" type="submit">
                      Comment on this commit
                    </Button>
                  </Grid.Column>
                </Grid>
              </Form>
            )}
          </Formik>
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
  currentUser: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired
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
