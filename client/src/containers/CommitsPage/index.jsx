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

    this.state = {
      branch: 'master'
    };

    this.handleBranchChange = this.handleBranchChange.bind(this);
  }

  componentDidMount() {
    const { username, reponame } = this.props.match.params;
    const { branch } = this.state;
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
    const { username, reponame } = this.props.match.params;
    const { branch } = this.state;

    this.setState(
      {
        branch: data.value
      },
      () => {
        this.props.fetchCommits({
          username,
          reponame,
          branch
        });
      }
    );
  }

  render() {
    const { commitsData, branchesData } = this.props;

    let branchOptions;
    if (!branchesData.loading) {
      branchOptions = branchesData.branches.map((branch, index) => ({
        key: index,
        text: branch,
        value: branch
      }));
    }

    return commitsData.loading || branchesData.loading ? (
      <Loader active />
    ) : (
      <div className={styles.commitsContainer}>
        <div className={styles.branchSelectRow}>
          <Dropdown
            value={this.state.branch}
            text="Branches"
            options={branchOptions}
            onChange={this.handleBranchChange}
          />
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
  match: PropTypes.object
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
