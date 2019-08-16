import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import RepoFileTree from '../../components/RepoFileTree/index';
import RepoReadme from '../../components/RepoReadme/index';
import { fetchBranches, fetchFileTree, fetchLastCommitOnBranch } from '../../routines/routines';

import Octicon, { getIconByName } from '@primer/octicons-react';
import { Container, Button, Header, Dropdown, Input, Popup, Segment, Menu, Loader, Divider } from 'semantic-ui-react';
import styles from './styles.module.scss';

class CodeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branch: ''
    };
    this.onBranchChange = this.onBranchChange.bind(this);
  }

  componentDidMount() {
    const { username, reponame, branch, history } = this.props;
    this.props.fetchBranches({ owner: username, repoName: reponame });
    this.setState({
      branch: branch || 'master'
    });
    history.push(`/${username}/${reponame}/tree/${branch}`);
    this.props.fetchLastCommitOnBranch({
      username,
      reponame,
      branch
    });
    this.props.fetchFileTree({
      username,
      reponame,
      branch
    });
  }

  onBranchChange = (event, data) => {
    this.setState(
      {
        branch: data.value
      },
      () => {
        const { username, reponame, history } = this.props;
        const { branch } = this.state;
        history.push(`/${username}/${reponame}/tree/${data.value}`);

        this.props.fetchLastCommitOnBranch({
          username,
          reponame,
          branch
        });
        this.props.fetchFileTree({
          username,
          reponame,
          branch
        });
      }
    );
  };

  render() {
    const { branch } = this.state;
    const { username, reponame, lastCommitData, branchesData, fileTreeData, history, fetchFileTree } = this.props;
    const { branches } = branchesData;
    const branchesCount = branches ? branches.length : 0;

    return lastCommitData.loading || fileTreeData.loading || branchesData.loading ? (
      <div>
        <Loader active />
      </div>
    ) : (
      <Container>
        <Divider hidden />
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
              <Link className={styles.repoMetaDataLinks} to={`/${username}/${reponame}/commits/${branch}`}>
                <b>4,325 </b> commits
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Octicon icon={getIconByName('git-branch')} />
              <Link className={styles.repoMetaDataLinks} to={`/${username}/${reponame}/branches`}>
                <b>{branchesCount} </b> branches
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
              position="bottom left"
            >
              <Dropdown.Menu className={styles.searchBranchList}>
                {branchesData.loading ? (
                  <Loader active />
                ) : (
                  <React.Fragment>
                    <Dropdown.SearchInput
                      type="text"
                      className={styles.searchBranchInput}
                      placeholder="Find or create a branch"
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
          <div className={styles.repoActions}>
            <Button.Group>
              <Button className={styles.actionButton}>Create New File</Button>
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
          username={username}
          reponame={reponame}
          branch={branch}
          history={history}
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
    branches: PropTypes.array,
    lastCommits: PropTypes.object
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
  history: PropTypes.object,
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  branch: PropTypes.string
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeTab);
