import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Item, Dropdown } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import './styles.module.scss';

export class CommitCommentItem extends Component {
  render() {
    const { key, body, author, authorId, avatar, hash, userId } = this.props;
    const isAbleToChange =
      userId === authorId ? (
        <div className="menu">
          <Dropdown item text="...">
            <Dropdown.Menu>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : null;
    return (
      <Item key={key} className="comment-item">
        <Item.Image
          size="tiny"
          src={
            avatar ? getUserImgLink(avatar) : 'https://forwardsummit.ca/wp-content/uploads/2019/01/avatar-default.png'
          }
        />
        <Item.Content>
          <Item.Header>
            <div className="name">
              <span>{author}</span>
              {` commented ${hash.slice(0, 7)}`}
            </div>
            {isAbleToChange}
          </Item.Header>
          <Item.Description>{body}</Item.Description>
        </Item.Content>
      </Item>
    );
  }
}

CommitCommentItem.defaultProps = {};

CommitCommentItem.propTypes = {
  author: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  hash: PropTypes.string.isRequired,
  match: PropTypes.object,
  userId: PropTypes.string.isRequired
};
