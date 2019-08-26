import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown, Header, Button, Divider, Form, Label, Icon, Image, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getUserImgLink } from '../../helpers/imageHelper';
import { getIssueByNumber, getIssueComments, postIssueComment } from '../../services/issuesService';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

import styles from './styles.module.scss';

class IssueComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIssue: {},
      issueComments: [],
      loading: true,
      comment: '',
      selectedTab: 'write',
      isDisabled: true
    };

    this.onCommentChange = this.onCommentChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const {
      match: {
        params: { username, reponame, number }
      }
    } = this.props;
    const currentIssue = await getIssueByNumber({
      username,
      reponame,
      number
    });
    const { id } = currentIssue;
    const issueComments = await getIssueComments(id);
    this.setState({
      currentIssue,
      issueComments,
      loading: false
    });
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

  async onSubmit() {
    this.setState({
      isDisabled: true
    });
    const {
      comment,
      currentIssue: { id: issueId }
    } = this.state;
    if (!comment) return;
    const {
      userId,
      // match: {
      //   params: { username, reponame }
      // }
    } = this.props;
    await postIssueComment({
      comment,
      issueId,
      userId
    });
    const issueComments = await getIssueComments(issueId);
    this.setState({
      comment: '',
      issueComments
    });
  }

  render() {
    const { currentIssue, issueComments, comment, selectedTab, isDisabled, loading } = this.state;
    const {
      match: { url }
    } = this.props;
    const newIssueUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');

    return loading ? (
      <Loader active />
    ) : (
      <>
        <div className={styles.header_row}>
          <Header as="h2">
            {currentIssue.title}
            <span>{` #${currentIssue.number}`}</span>
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
                  {issueComment.body ? <ReactMarkdown source={issueComment.body} /> : 'No description provided.'}
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
  userId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({
  userId: id
});

export default connect(mapStateToProps)(IssueComments);
