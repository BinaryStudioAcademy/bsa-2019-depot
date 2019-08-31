import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { fetchIssues, fetchCurrentRepo } from '../../routines/routines';
import IssuePrContainer from '../IssuePrContainer';

class IssuesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        title: '',
        author: '',
        assignees: [],
        opened: true
      }
    };
  }

  componentDidMount() {
    const {
      repositoryId,
      fetchIssues,
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const { filter } = this.state;
    if (!repositoryId) {
      fetchCurrentRepo({ username, reponame });
    } else {
      fetchIssues({
        username,
        reponame,
        repositoryId,
        filter
      });
    }
  }

  onChangeFilter = filter => {
    this.setState({
      filter
    });
  };

  render() {
    const { loading, issues } = this.props;
    const { onChangeFilter } = this.state;

    return loading ? (
      <Loader active />
    ) : (
      <IssuePrContainer data={issues} isIssues={true} onChangeFilter={onChangeFilter} />
    );
  }
}

IssuesTab.propTypes = {
  reponame: PropTypes.string,
  repositoryId: PropTypes.string,
  issues: PropTypes.array.isRequired,
  issuesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    issues: PropTypes.array
  }),
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  fetchIssues: PropTypes.func.isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  issuesData: { loading, issues },
  currentRepo: {
    currentRepoInfo: { id, name }
  }
}) => ({
  loading,
  issues,
  repositoryId: id
});

const mapDispatchToProps = {
  fetchIssues,
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesTab);
