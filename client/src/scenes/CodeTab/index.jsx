import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import RepoFileTree from '../../components/RepoFileTree/index';
import RepoReadme from '../../components/RepoReadme/index';
import { fetchLastCommitOnBranch, fetchBranches, fetchFileTree } from '../../routines/routines';

import Octicon, { getIconByName } from '@primer/octicons-react';
import { Container, Button, Header, Dropdown, Input, Popup, Segment, Menu, Dimmer, Loader } from 'semantic-ui-react';
import styles from './styles.module.scss';

class CodeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: 'TheSubliminal',
      repoName: 'depot-test',
      branch: 'master'
    };
    this.onBranchChange = this.onBranchChange.bind(this);
    this.onDropdownClick = this.onDropdownClick.bind(this);
    this.onCreateFile = this.onCreateFile.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const { owner, repoName, branch } = this.state;
    history.push(`/${owner}/${repoName}/tree/${branch}`);
    this.props.fetchLastCommitOnBranch({
      owner,
      repoName,
      branch
    });
    this.props.fetchFileTree({
      owner,
      repoName,
      branch
    });
  }

  onDropdownClick = event => {
    event.stopPropagation();
    const { owner, repoName } = this.state;
    this.props.fetchBranches({
      owner,
      repoName
    });
  };

  onBranchChange = (event, data) => {
    this.setState(
      {
        branch: data.value
      },
      () => {
        const { owner, repoName, branch } = this.state;
        const { history } = this.props;
        history.push(`/${owner}/${repoName}/tree/${data.value}`);

        this.props.fetchLastCommitOnBranch({
          owner,
          repoName,
          branch
        });
        this.props.fetchFileTree({
          owner,
          repoName,
          branch
        });
      }
    );
  };

  onCreateFile() {
    const { owner, repoName, branch } = this.state;
    const {
      history,
      fileTreeData: {
        tree: { currentPath }
      }
    } = this.props;

    history.push(`/${owner}/${repoName}/new/tree/${branch}/${currentPath}`);
  }

  render() {
    const { owner, repoName, branch } = this.state;
    const { lastCommitData, branchesData, fileTreeData, fetchFileTree } = this.props;

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
              <Link className={styles.repoMetaDataLinks} to="">
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
              text={`Branch: ${branch}`}
              floating
              width="seven"
              className={[styles.actionButton, styles.repoBranchesButton]}
              position="top left"
              onClick={this.onDropdownClick}
            >
              <Dropdown.Menu className={styles.searchBranchList}>
                {branchesData.loading ? (
                  <Dimmer active>
                    <Loader inverted />
                  </Dimmer>
                ) : (
                  <React.Fragment>
                    <Dropdown.SearchInput
                      type="text"
                      className={styles.searchBranchInput}
                      placeholder="Find or create a branch"
                      onClick={this.OnDropdownClick}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Header content="branch" as="h4" />
                    {branchesData.branches.map((branch, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={this.onBranchChange}
                        value={branch}
                        className={styles.branchesMenuItem}
                      >
                        {branch}
                      </Dropdown.Item>
                    ))}
                  </React.Fragment>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Button className={styles.actionButton}>New pull request</Button>
          </div>
          <div>
            <Button.Group className={styles.repoActions}>
              <Button className={styles.actionButton} onClick={this.onCreateFile}>
                Create New File
              </Button>
              <Button className={styles.actionButton}>Upload files</Button>
              <Button className={styles.actionButton}>Find file</Button>
            </Button.Group>
            <Popup
              trigger={
                <Dropdown button text="Clone or download" className={[styles.actionButton, styles.cloneRepoButton]} />
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
                  onClick={this.OnDropdownClick}
                  actionPosition="right"
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
        <RepoFileTree
          lastCommitData={lastCommitData}
          fileTreeData={fileTreeData}
          owner={owner}
          repoName={repoName}
          branch={branch}
          fetchFileTree={fetchFileTree}
        />
        <RepoReadme />
      </Container>
    );
  }
}

const mapStateToProps = ({ lastCommitData, branchesData, fileTreeData }) => ({
  lastCommitData,
  branchesData,
  fileTreeData
});

const mapDispatchToProps = {
  fetchLastCommitOnBranch,
  fetchBranches,
  fetchFileTree
};

CodeTab.propTypes = {
  branchesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    branches: PropTypes.array
  }).isRequired,
  lastCommitData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    commit: PropTypes.object
  }).isRequired,
  fileTreeData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    tree: PropTypes.object
  }).isRequired,
  fetchLastCommitOnBranch: PropTypes.func.isRequired,
  fetchBranches: PropTypes.func.isRequired,
  fetchFileTree: PropTypes.func.isRequired,
  history: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CodeTab));
