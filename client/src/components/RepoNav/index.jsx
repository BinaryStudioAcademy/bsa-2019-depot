import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Header, Dropdown, Input, Popup } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';

import styles from './styles.module.scss';

const RepoNav = props => {
  const { isOwn, branch, branches, onBranchChange, onCreateFile, OnDropdownClick } = props;

  function handleBranchChange(event, data) {
    const { value } = data;
    onBranchChange(value);
  }

  function handleCreatePull() {
    const { match, history } = props;
    const { username, reponame } = match.params;
    history.push(`/${username}/${reponame}/compare`);
  }

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
                placeholder="Find or create a branch"
              />
              <Dropdown.Divider />
              <Dropdown.Header content="branch" as="h4" />
              {branches.map((branch, index) => (
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
        <Button className={styles.actionButton} onClick={handleCreatePull}>New pull request</Button>
      </div>
      <div className={styles.repoActions}>
        <Button.Group>
          {isOwn && (
            <>
              <Button className={styles.actionButton} onClick={onCreateFile}>
                Create New File
              </Button>
              <Button className={styles.actionButton}>Upload files</Button>
            </>
          )}
          <Button className={styles.actionButton}>Find file</Button>
        </Button.Group>
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
              <div>
                Clone with HTTPS <Octicon className={styles.actionButton} icon={getIconByName('question')} />
              </div>
              <Link className={styles.link} to="">
                Use SSH
              </Link>
            </Header>
            <p>Use Git or checkout with SVN using the web URL.</p>
            <Input
              type="text"
              action={
                <Button className={styles.actionButton}>
                  <Octicon verticalAlign="middle" icon={getIconByName('clippy')} />
                </Button>
              }
              onClick={OnDropdownClick}
              size="small"
              className={styles.repoLinkInput}
              defaultValue="https://github.com/BinaryStudioAcademy/bsa-2019-depot.git"
            />
          </div>

          <Button.Group className={styles.repoPopupActions} attached="bottom">
            <Button compact className={styles.repoPopupAction}>
              Open in Desktop
            </Button>
            <Button compact className={styles.repoPopupAction}>
              Download ZIP
            </Button>
          </Button.Group>
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
  OnDropdownClick: PropTypes.func,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.object
};

export default withRouter(RepoNav);
