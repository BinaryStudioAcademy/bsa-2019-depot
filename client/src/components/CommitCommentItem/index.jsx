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
  }

  deleteComment() {
    const { id, deleteComment } = this.props;
    deleteComment(id);
  }

  startEditComment() {
    const { body } = this.props;
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

  onSubmit(text) {
    if (text !== '') {
      const { id, editComment, commentId, userId } = this.props;
      editComment(id, text, commentId, userId);
      this.setState({ ...this.state, isEditing: false, text: '' });
    }
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  render() {
    const { body, author, authorId, avatar, hash, userId, createdAt } = this.props;
    const { text, isEditing, selectedTab } = this.state;

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
            <span>{author}</span>
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
            avatar ? getUserImgLink(avatar) : 'https://forwardsummit.ca/wp-content/uploads/2019/01/avatar-default.png'
          }
        />
        <Item.Content>{commentElement}</Item.Content>
      </Item>
    );
  }
}

CommitCommentItem.defaultProps = {};

CommitCommentItem.propTypes = {
  author: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  id: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  match: PropTypes.object,
  commentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  editComment: PropTypes.func,
  deleteComment: PropTypes.func
};
