import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown, Button, Divider, Image, Message } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import htmlEntities from 'he';
import { CheckCircleFill } from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-react';

import styles from './styles.module.scss';
AntdIcon.add(CheckCircleFill);

class Comment extends React.Component {
  constructor(props) {
    super(props);

    const { body, newComment } = this.props;

    this.state = {
      comment: body,
      initialValue: body,
      selectedTab: 'write',
      editing: newComment,
      isDisabled: true
    };

    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.body !== prevProps.body) {
      const { body } = this.props;
      this.setState({ ...this.state, comment: body });
    }
  }

  onEdit() {
    this.setState({ ...this.state, editing: true, initialValue: this.state.comment });
  }

  onCancel() {
    this.setState({ ...this.state, editing: false, comment: this.state.initialValue });
  }

  onSubmit() {
    const { id, newComment } = this.props;
    const { comment } = this.state;
    const result = this.props.onSubmit(id, comment);
    if (result) {
      if (newComment) {
        this.setState({ ...this.state, comment: '', isDisabled: true });
      } else {
        this.setState({ ...this.state, editing: false });
      }
    }
  }

  onDelete() {
    const { id } = this.props;
    this.props.onDelete(id);
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

  renderStackOverflowQuestion() {
    const { question, avatar } = this.props;
    return (
      <div className={styles.questionWrapper}>
        <div className={styles.questionAvatar}>
          <Image src={getUserImgLink(avatar)} />
        </div>
        <a href={`${question.link}`} className={styles.questionLink} rel="noopener noreferrer" target="_blank">
          <Message
            icon={
              question.is_answered ? (
                <div title="Is answered">
                  <AntdIcon type={CheckCircleFill} className={styles.checkCircleButton} />
                </div>
              ) : null
            }
            header={htmlEntities.decode(question.title)}
            content={<>Posted on {moment.unix(question.creation_date).format('MMM DD, YYYY')} </>}
          />
        </a>
      </div>
    );
  }

  render() {
    const {
      id,
      avatar,
      username,
      createdAt,
      buttons,
      submitBtnTxt,
      cancelBtnTxt,
      onDelete,
      ownComment,
      isQuestion
    } = this.props;
    const { comment, selectedTab, isDisabled } = this.state;

    return isQuestion ? (
      this.renderStackOverflowQuestion()
    ) : (
      <div className={styles.issue_comment_wrapper} key={id}>
        <div className={styles.comment_author_avatar}>
          <Image src={getUserImgLink(avatar)} />
        </div>
        {this.state.editing ? (
          <div className={styles.mde}>
            <ReactMde
              className={styles.commentEditor}
              value={comment}
              onChange={this.onCommentChange}
              selectedTab={selectedTab}
              onTabChange={this.onTabChange}
              generateMarkdownPreview={this.renderPreview}
            />

            <Button
              positive
              compact
              floated="right"
              onClick={this.onSubmit}
              disabled={isDisabled}
              className={styles.button}
            >
              {submitBtnTxt}
            </Button>
            {cancelBtnTxt ? (
              <Button negative compact basic floated="right" onClick={this.onCancel}>
                {cancelBtnTxt}
              </Button>
            ) : null}
            {buttons ? buttons.map(button => button) : null}
          </div>
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
                  {ownComment ? (
                    <>
                      <Divider />
                      <Dropdown.Item text="Edit" onClick={this.onEdit} />
                      {onDelete ? <Dropdown.Item text="Delete" onClick={this.onDelete} /> : null}
                    </>
                  ) : null}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Divider className={styles.divide} />
            <div className={styles.issue_comment_desc}>
              {comment ? <ReactMarkdown source={comment} /> : 'No description provided.'}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Comment.propTypes = {
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
  cancelBtnTxt: PropTypes.string,
  ownComment: PropTypes.bool,
  onDelete: PropTypes.func,
  question: PropTypes.object,
  isQuestion: PropTypes.bool.isRequired
};

export default Comment;
