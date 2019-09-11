import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Header, Dropdown, Popup } from 'semantic-ui-react';
import CopyableInput from '../../components/CopyableInput';

import styles from './styles.module.scss';

const RepoNav = props => {
  const { isOwn, branch, branches, onBranchChange, onCreateFile, match } = props;
  const { username, reponame } = match.params;
  const [branchFilter, setBranchFilter] = useState('');

  function handleBranchChange(event, data) {
    const { value } = data;
    onBranchChange(value);
  }

  function handleCreatePull() {
    const { history } = props;
    history.push(`/${username}/${reponame}/compare`);
  }

  function handleBranchFilterChange({ target: { value } }) {
    setBranchFilter(value);
  }

  function handleBranchFilterClick(e) {
    e.stopPropagation();
  }

  function handleBranchFilterKeyDown(e) {
    if (e.key === 'Enter') {
      setBranchFilter('');
    }
  }

  const url = `git@${window.location.host}:${username}/${reponame}.git`;

  return (
    <div className={styles.repoNav}>
      <div>
        <Dropdown
          button
          text={`Branch: ${branch}`}
          floating
          width="seven"
          className={[styles.actionButton, styles.repoBranchesButton].join(' ')}
          position="bottom left"
        >
          <Dropdown.Menu className={styles.searchBranchList}>
            <React.Fragment>
              <Dropdown.SearchInput
                type="text"
                className={styles.searchBranchInput}
                placeholder="Find branch"
                onChange={handleBranchFilterChange}
                onClick={handleBranchFilterClick}
                onKeyDown={handleBranchFilterKeyDown}
                value={branchFilter}
              />
              <Dropdown.Divider />
              <Dropdown.Header content="branch" as="h4" className={styles.branchHeader} />
              {branches
                .filter(branch => branch.includes(branchFilter.toLowerCase()))
                .map((branch, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={handleBranchChange}
                    value={branch}
                    className={styles.branchesMenuItem}
                  >
                    {branch}
                  </Dropdown.Item>
                ))}
            </React.Fragment>
          </Dropdown.Menu>
        </Dropdown>
        <Button className={styles.actionButton} onClick={handleCreatePull}>
          New pull request
        </Button>
      </div>
      <div className={styles.repoActions}>
        {isOwn && (
          <Button className={styles.actionButton} onClick={onCreateFile}>
            Create New File
          </Button>
        )}
        <Popup
          trigger={
            <Dropdown
              button
              text="Clone or download"
              className={[styles.actionButton, styles.cloneRepoButton].join(' ')}
            />
          }
          flowing
          on="click"
          position="bottom right"
          className={styles.repoPopup}
        >
          <div className={styles.repoPopupBody}>
            <Header className={styles.readmeHeader} as="h4">
              <div>Clone with SSH</div>
            </Header>
            <p>Use a password protected SSH key.</p>
            <CopyableInput url={url} />
          </div>
        </Popup>
      </div>
    </div>
  );
};

RepoNav.propTypes = {
  isOwn: PropTypes.bool,
  branch: PropTypes.string,
  branches: PropTypes.array,
  onBranchChange: PropTypes.func.isRequired,
  onCreateFile: PropTypes.func.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.object
};

export default withRouter(RepoNav);
