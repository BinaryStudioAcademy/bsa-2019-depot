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
    const { branch } = this.props.match.params;
    const { repoId } = this.props;

    this.props.fetchCommits({
      repoId,
      branch
    });
  }

  handleBranchChange(event, data) {
    const { username, reponame } = this.props.match.params;
    const { repoId, history } = this.props;

    history.push(`/${username}/${reponame}/commits/${data.value}`);

    this.props.fetchCommits({
      repoId,
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

    const branchOptions = branchesData.map(({ name }, index) => ({
      key: index,
      text: name,
      value: name
    }));
    branchOptions.sort(({ text: textA }, { text: textB }) => (textA > textB ? 1 : -1));

    return commitsData.loading ? (
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
  repoId: PropTypes.string.isRequired,
  commitsData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    commits: PropTypes.array
  }).isRequired,
  branchesData: PropTypes.array.isRequired,
  fetchCommits: PropTypes.func.isRequired,
  fetchBranches: PropTypes.func.isRequired,
  username: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id: repoId, branches: branchesData }
    }
  },
  commitsData
}) => ({
  repoId,
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
