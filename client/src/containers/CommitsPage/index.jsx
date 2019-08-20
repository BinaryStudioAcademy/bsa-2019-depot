import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Loader } from 'semantic-ui-react';
import CommitsList from '../../components/CommitsList';
import { fetchCommits, fetchBranches } from '../../routines/routines';

import styles from './styles.module.scss';

class CommitsPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleBranchChange = this.handleBranchChange.bind(this);
  }

  componentDidMount() {
    const { username, reponame, branch } = this.props.match.params;

    this.props.fetchBranches({
      owner: username,
      repoName: reponame
    });
    this.props.fetchCommits({
      username,
      reponame,
      branch
    });
  }

  handleBranchChange(event, data) {
    const { match, history } = this.props;
    const { username, reponame } = match.params;

    history.push(`/${username}/${reponame}/commits/${data.value}`);

    this.props.fetchBranches({
      owner: username,
      repoName: reponame
    });
    this.props.fetchCommits({
      username,
      reponame,
      branch: data.value
    });
  }

  render() {
    const {
      commitsData,
      branchesData,
      match: {
        params: { branch }
      }
    } = this.props;

    let branchOptions;
    if (!branchesData.loading) {
      branchOptions = branchesData.branches.map((branch, index) => ({
        key: index,
        text: branch,
        value: branch
      }));
      branchOptions.sort(({ text: textA }, { text: textB }) => (textA > textB ? 1 : -1));
    }

    return commitsData.loading || branchesData.loading ? (
      <Loader active />
    ) : (
      <div className={styles.commitsContainer}>
        <div className={styles.branchSelectRow}>
          <Dropdown value={branch} text="Branches" options={branchOptions} onChange={this.handleBranchChange} />
        </div>
        <CommitsList commits={commitsData.commits} />
      </div>
    );
  }
}

CommitsPage.propTypes = {
  commitsData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    commits: PropTypes.array
  }).isRequired,
  branchesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    branches: PropTypes.array,
    lastCommits: PropTypes.object
  }).isRequired,
  fetchCommits: PropTypes.func.isRequired,
  fetchBranches: PropTypes.func.isRequired,
  username: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = ({ commitsData, branchesData }) => ({
  commitsData,
  branchesData
});

const mapDispatchToProps = {
  fetchCommits,
  fetchBranches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommitsPage);
