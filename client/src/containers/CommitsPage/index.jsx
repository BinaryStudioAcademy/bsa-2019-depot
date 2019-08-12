import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Loader } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
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
    const { commitsData, branchesData, fetchBranches, fetchCommits } = this.props;
    fetchBranches({
      // Mock
      owner: 'TheSubliminal',
      repoName: 'depot-test'
    });
    fetchCommits({
      // Mock
      owner: 'TheSubliminal',
      repoName: 'depot-test',
      branch: this.state.branch
    });

    if (commitsData.error) {
      this.notify(commitsData.error);
    }
    if (branchesData.error) {
      this.notify(branchesData.error);
    }
  }

  handleBranchChange(event, data) {
    this.setState(
      {
        branch: data.value
      },
      () => {
        this.props.fetchCommits({
          // Mock
          owner: 'TheSubliminal',
          repoName: 'depot-test',
          branch: this.state.branch
        });
      }
    );
  }

  notify = error => toast(error, { type: toast.TYPE.ERROR, hideProgressBar: true });

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
      <Fragment>
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
        <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      </Fragment>
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
    branches: PropTypes.array
  }).isRequired,
  /*repoName: PropTypes.string.isRequired,*/
  fetchCommits: PropTypes.func.isRequired,
  fetchBranches: PropTypes.func.isRequired
};

const mapStateToProps = ({ commitsData, branchesData /*, repoName*/ }) => ({
  commitsData,
  branchesData /*,
    repoName*/
});

const mapDispatchToProps = {
  fetchCommits,
  fetchBranches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommitsPage);
