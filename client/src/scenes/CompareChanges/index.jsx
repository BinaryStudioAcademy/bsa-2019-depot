import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import SelectCompareBranches from '../../components/SelectCompareBranches';
import DiffList from '../../components/DiffList';
import { getBranchDiffs } from '../../services/pullsService';

import styles from './styles.module.scss';

class CompareChanges extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fromBranch: this.props.branches[0],
      toBranch: this.props.branches[0],
      diffs: null
    };

    this.onToBranchChange = this.onToBranchChange.bind(this);
    this.onFromBranchChange = this.onFromBranchChange.bind(this);
  }

  componentDidMount() {
    this.updateBranchDiffs();
  }

  updateBranchDiffs() {
    const { repositoryId } = this.props;
    const { fromBranch, toBranch } = this.state;

    this.setState({ loading: true });
    getBranchDiffs(repositoryId, { fromBranch, toBranch })
      .then(({ diffs }) => {
        this.setState({ loading: false, diffs });
      });
  }

  onToBranchChange(event, { value }) {
    this.setState({ toBranch: value }, () => {
      this.updateBranchDiffs();
    });
  }

  onFromBranchChange(event, { value }) {
    this.setState({ fromBranch: value }, () => {
      this.updateBranchDiffs();
    });
  }

  render() {
    const { diffs, fromBranch, toBranch, loading } = this.state;
    const { branches } = this.props;

    return (
      <>
        <div className={styles.header}>
          <h1>Comparing changes</h1>
          <h5>Choose two branches to see what’s changed or to start a new pull request</h5>
        </div>
        <SelectCompareBranches
          fromBranch={fromBranch}
          toBranch={toBranch}
          branches={branches}
          onToBranchChange={this.onToBranchChange}
          onFromBranchChange={this.onFromBranchChange}
        />
        {loading
          ? <Loader active />
          : (diffs && diffs.length
            ? <DiffList diffs={diffs}/>
            : (
              <div className={styles.diffInfo}>
                <h3>There isn’t anything to compare.</h3>
                <p>
                  {fromBranch === toBranch
                    ? 'You’ll need to use two different branch names to get a valid comparison.'
                    : (
                        <>
                          <b>{toBranch}</b> is up to date with all commits from <b>{fromBranch}</b>. Try switching the base for your comparison.
                        </>
                    )
                  }
                </p>
              </div>
            )
          )
        }
      </>
    );
  }
}

CompareChanges.propTypes = {
  repositoryId: PropTypes.string.isRequired,
  branches: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = ({ currentRepo: { repository: { currentRepoInfo: { id, branches } } } }) => ({
  repositoryId: id,
  branches
});

export default connect(mapStateToProps)(CompareChanges);
