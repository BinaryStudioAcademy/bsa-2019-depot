import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Segment } from 'semantic-ui-react';
import Octicon, { GitPullRequest } from '@primer/octicons-react';
import SelectCompareBranches from '../../components/SelectCompareBranches';

import styles from './styles.module.scss';

class CompareChanges extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromBranch: this.props.branches[0],
      toBranch: this.props.branches[0]
    };
  }

  render() {
    const { fromBranch, toBranch } = this.state;
    const { branches } = this.props;

    return(
      <>
        <div className={styles.header}>
          <h1>Comparing changes</h1>
          <h5>Choose two branches to see what’s changed or to start a new pull request</h5>
        </div>
        <SelectCompareBranches fromBranch={fromBranch} toBranch={toBranch} branches={branches}/>
      </>
    );
  }
}

CompareChanges.propTypes = {
  branches: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = ({ currentRepo: { repository: { currentRepoInfo: { branches } } } }) => ({
  branches
});

export default connect(mapStateToProps)(CompareChanges);
