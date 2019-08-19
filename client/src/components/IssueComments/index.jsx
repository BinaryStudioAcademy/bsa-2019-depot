import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { fetchIssueComments } from '../../routines/routines';

import './styles.module.scss';

class IssueComments extends React.Component {
  componentDidMount() {
    const {
      fetchIssueComments,
      username,
      repoName,
      match: {
        params: { number: issueNumber }
      }
    } = this.props;
    fetchIssueComments({ username, repoName, issueNumber });
  }

  render() {
    return <List divided verticalAlign="middle"></List>;
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
  repoName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { username }
  },
  currentRepo: {
    currentRepoInfo: { repoName }
  }
}) => ({
  username,
  repoName
});

const mapDispatchToProps = { fetchIssueComments };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueComments);
