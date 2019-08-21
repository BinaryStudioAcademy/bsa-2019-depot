import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { Item, Dropdown, Button } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import './styles.module.scss';

export class CommitCommentItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      text: '',
      selectedTab: 'write',
      error: ''
    };

    this.onCancel = this.onCancel.bind(this);
    this.startEditComment = this.startEditComment.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  deleteComment() {
    const { comment } = this.props;
    this.props.deleteComment(comment.id);
  }

  startEditComment() {
    const { body } = this.props.comment;
    this.setState({ ...this.state, isEditing: true, text: body });
  }

  onTabChange(selectedTab) {
    this.setState({ ...this.state, selectedTab });
  }

  onBodyChange(text) {
    this.setState({ ...this.state, text });
  }

  onCancel() {
    this.setState({ ...this.state, isEditing: false });
  }

  onSubmit() {
    const { text } = this.state;
    if (text !== '') {
      const { editComment, comment, userId } = this.props;
      const { id, commitId } = comment;
      editComment(id, text, commitId, userId);
      this.setState({ ...this.state, isEditing: false, text: '' });
    }
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  render() {
    const { comment, hash, userId } = this.props;
    const { body, author, createdAt } = comment;
    const { id: authorId, name, username, imgUrl } = author;
    const { text, isEditing, selectedTab } = this.state;
    const authorTitle = name || username;

    const isAbleToChange =
      userId === authorId ? (
        <div className="menu">
          <Dropdown item text="...">
            <Dropdown.Menu>
              <Dropdown.Item onClick={this.startEditComment}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={this.deleteComment}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : null;
    const commentElement = isEditing ? (
      <>
        <ReactMde
          value={text}
          onChange={this.onBodyChange}
          selectedTab={selectedTab}
          onTabChange={this.onTabChange}
          generateMarkdownPreview={this.renderPreview}
        />
        <Button color="blue" floated="right" type="submit" onClick={this.onSubmit}>
          Update comment text
        </Button>
        <Button floated="right" type="cancel" className="cancel-button" onClick={this.onCancel}>
          Cancel
        </Button>
      </>
    ) : (
      <>
        <Item.Header>
          <div className="name">
            <span>{authorTitle}</span>
            {` commented ${hash.slice(0, 7)} ${moment(createdAt).fromNow()}`}
          </div>
          {isAbleToChange}
        </Item.Header>
        <Item.Description>
          <ReactMarkdown source={body} />
        </Item.Description>
      </>
    );

    return (
      <Item className="comment-item">
        <Item.Image
          size="tiny"
          src={
            imgUrl ? getUserImgLink(imgUrl) : 'https://forwardsummit.ca/wp-content/uploads/2019/01/avatar-default.png'
          }
        />
        <Item.Content>{commentElement}</Item.Content>
      </Item>
    );
  }
}

CommitCommentItem.defaultProps = {};

CommitCommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      username: PropTypes.string,
      name: PropTypes.string
    }),
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    commitId: PropTypes.string.isRequired
  }),
  hash: PropTypes.string.isRequired,
  match: PropTypes.object,
  userId: PropTypes.string.isRequired,
  editComment: PropTypes.func,
  deleteComment: PropTypes.func
};