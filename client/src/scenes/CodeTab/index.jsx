import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RepoFileTree from '../../components/RepoFileTree/index';
import RepoReadme from '../../components/RepoReadme/index';

import Octicon, { getIconByName } from '@primer/octicons-react';
import { Container, Button, Header, Dropdown, Input, Popup, Segment, Menu } from 'semantic-ui-react';
import styles from './styles.module.scss';

const OnDropdownClick = e => e.stopPropagation();

class CodeTab extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <Container>
        <div className={styles.repoDescription}>
          <div className={styles.repoDescriptionText}>
            Semantic is a UI component framework based around useful principles from natural language.{' '}
            <Link className={styles.link} to="http://www.semantic-ui.com">
              {' '}
              http://www.semantic-ui.com
            </Link>
          </div>
          <Button className={styles.actionButton}>Edit</Button>
        </div>
        <div>
          <Menu borderless attached="top" widths={4}>
            <Menu.Item>
              <Octicon icon={getIconByName('history')} />
              <Link className={styles.repoMetaDataLinks} to={`${match.url}/commits`}>
                <b>4,325 </b> commits
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Octicon icon={getIconByName('git-branch')} />
              <Link className={styles.repoMetaDataLinks} to="">
                <b>7 </b> branches
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Octicon icon={getIconByName('tag')} />
              <Link className={styles.repoMetaDataLinks} to="">
                <b>77 </b> releases
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Octicon icon={getIconByName('organization')} />
              <Link className={styles.repoMetaDataLinks} to="">
                <b>10 </b> contributors
              </Link>
            </Menu.Item>
          </Menu>
          <Segment.Group className={styles.languageSegments} attached="bottom" horizontal>
            <Segment className={styles.languageSegment} inverted color="yellow" />
            <Segment className={styles.languageSegment} inverted color="purple" />
            <Segment className={styles.languageSegment} inverted color="red" />
          </Segment.Group>
        </div>

        <div className={styles.repoNav}>
          <div>
            <Dropdown
              button
              text="Branch: master"
              floating
              width="seven"
              className={[styles.actionButton, styles.repoBranchesButton].join(' ')}
              position="top left"
            >
              <Dropdown.Menu className={styles.searchBranchList}>
                <Dropdown.SearchInput
                  type="text"
                  className={styles.searchBranchInput}
                  placeholder="Find or create a branch"
                  onClick={OnDropdownClick}
                />
                <Dropdown.Divider />
                <Dropdown.Header content="branch" as="h4" />
                <Dropdown.Item className={styles.branchesMenuItem}>master</Dropdown.Item>
                <Dropdown.Item className={styles.branchesMenuItem}>develop</Dropdown.Item>
                <Dropdown.Item className={styles.branchesMenuItem}>hotfix</Dropdown.Item>
                <Dropdown.Item className={styles.branchesMenuItem}>patch/add-new-feature</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button className={styles.actionButton}>New pull request</Button>
          </div>
          <div>
            <Button.Group className={styles.repoActions}>
              <Button className={styles.actionButton}>Create New File</Button>
              <Button className={styles.actionButton}>Upload files</Button>
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
        <RepoFileTree />
        <RepoReadme />
      </Container>
    );
  }
}

CodeTab.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default CodeTab;
