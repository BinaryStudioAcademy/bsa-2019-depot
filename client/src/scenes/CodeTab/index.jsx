import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import RepoFileTree from '../../components/RepoFileTree/index';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import RepoReadme from '../../components/RepoReadme/index';
import { fetchBranch, fetchFileTree, fetchCurrentRepo } from '../../routines/routines';
import * as repositoryService from '../../services/repositoryService';
import { newFile } from './actions';
import RepoDescription from '../../components/RepoDescription';
import CodeTabMenu from '../../components/CodeTabMenu';
import RepoNav from '../../components/RepoNav';
import EmptyRepositoryTab from '../../containers/EmptyRepositoryTab';

import {
  Container,
  Button,
  Loader,
  Divider,
  Message,
  Breadcrumb
} from 'semantic-ui-react';
import styles from './styles.module.scss';


class CodeTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      branch: ''
    };

    this.onBranchChange = this.onBranchChange.bind(this);
    this.onCreateFile = this.onCreateFile.bind(this);
    this.onSubmitInfo = this.onSubmitInfo.bind(this);
  }

  componentDidMount() {
    const {
      repoID,
      ownername,
      reponame,
      fetchBranch,
      fetchFileTree,
      branches,
      defaultBranch,
      match,
      history
    } = this.props;
    let { params: { branch } } = match;
    if (!branch) {
      branch = defaultBranch || branches[0];
    }

    this.setState({
      ...this.state,
      branch
    });

    if (!branches.length) {
      return;
    }

    const defaultPath = `/${ownername}/${reponame}/tree/${branch}`;
    history.push(defaultPath);

    fetchBranch({ repoID, branch });

    const pathToDir = match.url
      .replace(`${defaultPath}`, '')
      .replace(`${ownername}/${reponame}`, '')
      .split('/')
      .filter(path => path)
      .join('/');

    fetchFileTree({
      username: ownername,
      reponame,
      branch,
      query: { pathToDir }
    });

    history.push(`${defaultPath}${pathToDir ? `/${pathToDir}` : ''}`);
  }

  onBranchChange = (branch) => {
    const { ownername, repoID, reponame, history, fetchBranch } = this.props;
    history.push(`/${ownername}/${reponame}/tree/${branch}`);
    this.setState({
      ...this.state,
      branch
    });
    fetchBranch({ repoID, branch });
    this.props.fetchFileTree({
      username: ownername,
      reponame,
      branch
    });
  };

  onCreateFile = () => {
    const { location, history } = this.props;
    history.push(location.pathname.replace('/tree', '/new'));
  };

  onReadmeEdit = () => {
    const {
      history,
      match,
      fileTreeData: {
        tree: { currentPath }
      }
    } = this.props;
    const { username, reponame, branch } = match.params;

    history.push(`/${username}/${reponame}/edit/${branch}/${currentPath}/README.md`);
  };

  onAddReadme = () => {
    const {
      history,
      match,
      fileTreeData: {
        tree: { currentPath }
      }
    } = this.props;
    const { description } = this.props;
    const { username, reponame, branch } = match.params;

    this.props.newFile({ filename: 'README.md', content: `# ${reponame}\n\n${description}` });
    history.push(`/${username}/${reponame}/new/${branch}/${currentPath}`);
  };

  async onSubmitInfo({ description, website }) {
    const { username: owner, reponame } = this.props.match.params;

    await repositoryService
      .updateRepositoryByOwnerAndName({ owner, reponame, request: { description, website } });

    const { fetchCurrentRepo } = this.props;
    fetchCurrentRepo({ username: owner, reponame });
  };

  renderReadMe(readme, isOwn) {
    if (readme) {
      return (
        <RepoReadme
          content={readme.content}
          showEdit={isOwn}
          onReadmeEdit={this.onReadmeEdit}
        />
      );
    } else if (isOwn) {
      return (
        <Message color="blue" className={styles.readmeTip}>
          Help people interested in this repository understand your project by adding a README.
          <Button className={styles.addReadme} size="small" compact positive onClick={this.onAddReadme}>
            Add a README
          </Button>
        </Message>
      );
    }

    return null;
  }

  render() {
    const {
      reponame,
      ownername,
      description,
      website,
      branches,
      currentBranchData,
      fileTreeData,
      currentUserName,
      fetchFileTree,
      location,
      history
    } = this.props;

    if (!branches.length) {
      return <EmptyRepositoryTab />;
    }

    const { headCommit, commitsCount: { count } } = currentBranchData;
    const { files } = fileTreeData.tree;

    const { branch } = this.state;

    const isOwn = currentUserName && currentUserName === ownername;

    const readme = files && files.find(file => file.name === 'README.md');
    const branchesCount = branches ? branches.length : 0;

    const rootDir = `/${ownername}/${reponame}/tree/${branch}`;
    const pathToDir = location.pathname
      .replace(rootDir, '')
      .split('/')
      .filter(path => path);
    const currentDir = pathToDir.pop();
    this.toRootDir = () => {
      history.push(rootDir);
      window.location.reload();
    };

    const { loading: branchDataLoading } = currentBranchData;
    const { loading: fileTreeLoading } = fileTreeData;

    return branchDataLoading || fileTreeLoading ? (
      <div>
        <Loader active />
      </div>
    ) : (
      <Container className={styles.contentContainer}>
        <Divider hidden />
        <RepoDescription
          isOwn={isOwn}
          description={description}
          website={website}
          onSubmit={this.onSubmitInfo}
        />
        <CodeTabMenu
          ownername={ownername}
          branch={branch}
          reponame={reponame}
          commitsCount={count}
          branchesCount={branchesCount}
        />
        <RepoNav
          isOwn={isOwn}
          branch={branch}
          branches={branches}
          onBranchChange={this.onBranchChange}
          onCreateFile={this.onCreateFile}
        />
        {currentDir ? (
          <div className={styles.filePathRow}>
            <Breadcrumb size="big" className={styles.filePath}>
              <Breadcrumb.Section>
                <Link to="" onClick={this.toRootDir}>
                  {reponame}
                </Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider />
              <FilePathBreadcrumbSections owner={ownername} reponame={reponame} branch={branch} filepath={pathToDir} />
              <Breadcrumb.Section>{currentDir}</Breadcrumb.Section>
            </Breadcrumb>
          </div>
        ) : null}
        <RepoFileTree
          lastCommitData={headCommit}
          fileTreeData={fileTreeData}
          username={ownername}
          reponame={reponame}
          branch={branch}
          history={history}
          fetchFileTree={fetchFileTree}
        />
        {this.renderReadMe(readme, isOwn)}
      </Container>
    );
  }
}

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: {
        id: repoID,
        name: reponame,
        branches,
        defaultBranch,
        description,
        website,
        user: {
          username: ownername
        }
      }
    },
    branch: currentBranchData,
    fileTreeData
  },
  profile: {
    currentUser: {
      username: currentUserName
    }
  }
}) => ({
  repoID,
  reponame,
  ownername,
  description,
  website,
  branches,
  defaultBranch,
  currentUserName,
  currentBranchData,
  fileTreeData
});

const mapDispatchToProps = {
  newFile,
  fetchBranch,
  fetchFileTree,
  fetchCurrentRepo
};

CodeTab.propTypes = {
  fileTreeData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    tree: PropTypes.object
  }).isRequired,
  newFile: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  currentUser: PropTypes.string,
  username: PropTypes.string,
  reponame: PropTypes.string,
  branch: PropTypes.string,
  repoID: PropTypes.string.isRequired,
  ownername: PropTypes.string,
  fetchBranch: PropTypes.func,
  fetchFileTree: PropTypes.func,
  fetchCurrentRepo: PropTypes.func,
  branches: PropTypes.array,
  defaultBranch: PropTypes.string,
  description: PropTypes.string,
  website: PropTypes.string,
  currentBranchData: PropTypes.shape({
    name: PropTypes.string,
    headCommit: PropTypes.object,
    commitsCount: {
      count: PropTypes.number
    },
    loading: PropTypes.bool
  }),
  currentUserName: PropTypes.string
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CodeTab));
