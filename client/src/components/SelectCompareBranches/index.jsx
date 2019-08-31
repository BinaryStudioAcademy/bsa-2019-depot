import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Segment } from 'semantic-ui-react';
import Octicon, { GitCompare, ArrowLeft, GitPullRequest } from '@primer/octicons-react';

import styles from './styles.module.scss';

const SelectCompareBranches = ({ branches, toBranch, fromBranch, onBranchChange, onCreatePullRequest }) => {
  return (
    <Segment className={styles.selectBranchesContainer}>
      <div>
        <Octicon icon={GitCompare} className={styles.gitCompare}/>
        <Dropdown
          button
          text={`To branch: ${toBranch}`}
          floating
          width="seven"
          className={[styles.actionButton, styles.repoBranchesButton].join(' ')}
          position="bottom left"
        >
          <Dropdown.Menu>
            <Dropdown.Header content="branch" as="h4" />
            {branches.map((branch, index) => (
              <Dropdown.Item
                key={index}
                onClick={onBranchChange}
                value={branch}
              >
                {branch}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Octicon icon={ArrowLeft}/>
        <Dropdown
          button
          text={`From branch: ${fromBranch}`}
          floating
          width="seven"
          className={[styles.actionButton, styles.repoBranchesButton].join(' ')}
          position="bottom left"
        >
          <Dropdown.Menu>
            <Dropdown.Header content="branch" as="h4" />
            {branches.map((branch, index) => (
              <Dropdown.Item
                key={index}
                onClick={onBranchChange}
                value={branch}
              >
                {branch}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Button
        compact
        primary
        className={styles.createPullRequest}
        onClick={onCreatePullRequest}
      >
        <Octicon icon={GitPullRequest}/>
        Create pull request
      </Button>
    </Segment>
  );
};

SelectCompareBranches.propTypes = {
  branches: PropTypes.array.isRequired,
  toBranch: PropTypes.string.isRequired,
  fromBranch: PropTypes.string.isRequired,
  onBranchChange: PropTypes.func// .isRequired
};

export default SelectCompareBranches;
