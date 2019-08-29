import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown, Button, Divider, Form, Image } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

import styles from './styles.module.scss';

class IssueComment extends React.Component {
  constructor(props) {
    super(props);

    const { body, newComment } = this.props;

    this.state = {
      comment: body,
      selectedTab: 'write',
      editing: newComment,
      isDisabled: true
    };

    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  onEdit() {
    this.setState({ ...this.state, editing: true });
  }

  onCancel() {
    this.setState({ ...this.state, editing: false });
  }

  onCommentChange(comment) {
    const isDisabled = !comment;
    this.setState({ ...this.state, comment, isDisabled });
  }

  onTabChange(selectedTab) {
    this.setState({ ...this.state, selectedTab });
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  render() {
    const {
      id,
      avatar,
      username,
      createdAt,
      body,
      dropdowns,
      buttons,
      onSubmit,
      submitBtnTxt,
      cancelBtnTxt
    } = this.props;
    const { comment, selectedTab, isDisabled } = this.state;

    return (
      <div className={styles.issue_comment_wrapper} key={id}>
        <div className={styles.comment_author_avatar}>
          <Image src={getUserImgLink(avatar)} />
        </div>
        {this.state.editing ? (
          <Form className={styles.issueForm} onSubmit={this.onSubmit}>
            <div className={styles.commentEditor}>
              <ReactMde
                value={comment}
                onChange={this.onCommentChange}
                selectedTab={selectedTab}
                onTabChange={this.onTabChange}
                generateMarkdownPreview={this.renderPreview}
              />
            </div>

            <Button
              positive
              compact
              floated="right"
              type="submit"
              disabled={isDisabled}
              onClick={onSubmit}
              className={styles.button}
            >
              {submitBtnTxt}
            </Button>
            {cancelBtnTxt ? (
              <Button negative compact basic floated="right" type="button" onClick={this.onCancel}>
                {cancelBtnTxt}
              </Button>
            ) : null}
            {buttons ? buttons.map(button => button) : null}
          </Form>
        ) : (
          <div className={styles.issue_comment_container}>
            <div className={styles.issue_comment_header}>
              <span className={styles.comment_author_name}>
                {`${username} `}
                <span>{`commented ${moment(createdAt).fromNow()}`}</span>
              </span>

              <Dropdown className={styles.dropdown_header} icon="ellipsis horizontal">
                <Dropdown.Menu>
                  <Dropdown.Item text="Copy link" />
                  <Dropdown.Item text="Quote reply" />
                  <Divider />
                  <Dropdown.Item text="Edit" onClick={this.onEdit} />
                  {dropdowns ? dropdowns.map(dropdown => dropdown) : null}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Divider className={styles.divide} />
            <div className={styles.issue_comment_desc}>
              {body ? <ReactMarkdown source={body} /> : 'No description provided.'}
            </div>
          </div>
        )}
      </div>
    );
  }
}

IssueComment.propTypes = {
  id: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string,
  dropdowns: PropTypes.array,
  buttons: PropTypes.array,
  newComment: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitBtnTxt: PropTypes.string,
  cancelBtnTxt: PropTypes.string
};

export default IssueComment;
