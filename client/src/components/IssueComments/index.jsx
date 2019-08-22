import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown, Header, Button, Divider, Form, Label, Icon, Image, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getUserImgLink } from '../../helpers/imageHelper';
import { fetchIssueComments, createIssueComment } from '../../routines/routines';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

import styles from './styles.module.scss';

class IssueComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      selectedTab: 'write',
      isDisabled: true
    };

    this.onCommentChange = this.onCommentChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {
      fetchIssueComments,
      match: {
        params: { username, reponame, number: issueNumber }
      }
    } = this.props;
    fetchIssueComments({ username, reponame, issueNumber });
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

  onSubmit() {
    const { comment } = this.state;
    if (!comment) return;

    const {
      createIssueComment,
      userId,
      match: {
        params: { username, reponame, number: issueNumber }
      }
    } = this.props;
    createIssueComment({
      username,
      reponame,
      comment,
      issueNumber,
      userId
    });
    this.setState({ comment: '' });
  }

  render() {
    const { comment, selectedTab, isDisabled } = this.state;
    const {
      issues,
      issueComments,
      loading,
      match: {
        url,
        params: { number }
      }
    } = this.props;
    const newIssueUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');
    const currentIssue = issues.find(issue => issue.id === +number);

    return loading ? (
      <Loader active />
    ) : (
      <>
        <div className={styles.header_row}>
          <Header as="h2">
            {currentIssue.title}
            <span>{` #${currentIssue.id}`}</span>
          </Header>
          <Link to={`${newIssueUrl}/new`}>
            <Button compact positive content="New Issue" primary />
          </Link>
        </div>
        <div>
          <Label color={currentIssue.isOpened ? 'green' : 'red'}>
            <Icon name="exclamation circle" /> {currentIssue.isOpened ? 'Open' : 'Closed'}
          </Label>
          <span className={styles.comment_author_name}>
            {`${currentIssue.user.username} `}
            <span>{`opened this issue ${moment(currentIssue.createdAt).fromNow()} · ${
              issueComments.length
            } comments`}</span>
          </span>
        </div>

        <div className={styles.issue_comment_wrapper}>
          <div className={styles.comment_author_avatar}>
            <Image src={getUserImgLink(currentIssue.user.avatar)} />
          </div>

          <div className={styles.issue_comment_container}>
            <div className={styles.issue_comment_header}>
              <span className={styles.comment_author_name}>
                {`${currentIssue.user.username} `}
                <span>{`commented ${moment(currentIssue.createdAt).fromNow()}`}</span>
              </span>
              <Dropdown className={styles.dropdown_header} icon="ellipsis horizontal">
                <Dropdown.Menu>
                  <Link to="">
                    <Dropdown.Item text="Copy link" />
                  </Link>
                  <Link to="">
                    <Dropdown.Item text="Quote reply" />
                  </Link>
                  <Divider />
                  <Link to="">
                    <Dropdown.Item text="Edit" />
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Divider className={styles.divide} />
            <div className={styles.issue_comment_desc}>
              {currentIssue.body ? currentIssue.body : 'No description provided.'}
            </div>
          </div>
        </div>

        {issueComments.length > 0 &&
          issueComments.map(issueComment => (
            <div className={styles.issue_comment_wrapper} key={issueComment.id}>
              <div className={styles.comment_author_avatar}>
                <Image src={getUserImgLink(currentIssue.user.avatar)} />
              </div>

              <div className={styles.issue_comment_container}>
                <div className={styles.issue_comment_header}>
                  <span className={styles.comment_author_name}>
                    {`${issueComment.user.username} `}
                    <span>{`commented ${moment(issueComment.createdAt).fromNow()}`}</span>
                  </span>

                  <Dropdown className={styles.dropdown_header} icon="ellipsis horizontal">
                    <Dropdown.Menu>
                      <Link to="">
                        <Dropdown.Item text="Copy link" />
                      </Link>
                      <Link to="">
                        <Dropdown.Item text="Quote reply" />
                      </Link>
                      <Divider />
                      <Link to="">
                        <Dropdown.Item text="Edit" />
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Divider className={styles.divide} />
                <div className={styles.issue_comment_desc}>
                  {issueComment.body ? issueComment.body : 'No description provided.'}
                </div>
              </div>
            </div>
          ))}
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
          <Button positive floated="right" type="submit" disabled={isDisabled}>
            Comment
          </Button>
        </Form>
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
  fetchIssueComments: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired,
  issueComments: PropTypes.array.isRequired,
  createIssueComment: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  issuesData: { issues },
  issueCommentsData: { issueComments, loading },
  profile: {
    currentUser: { id }
  }
}) => ({
  userId: id,
  issues,
  issueComments,
  loading
});

const mapDispatchToProps = { fetchIssueComments, createIssueComment };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueComments);
