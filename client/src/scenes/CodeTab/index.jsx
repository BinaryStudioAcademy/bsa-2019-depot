import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RepoFileTree from '../../components/RepoFileTree/index';
import * as commitsService from '../../services/commitsService';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import RepoReadme from '../../components/RepoReadme/index';
import { InputError } from '../../components/InputError';
import { fetchBranches, fetchFileTree, fetchLastCommitOnBranch } from '../../routines/routines';
import * as repositoryService from '../../services/repositoryService';
import * as branchesService from '../../services/branchesService';
import { newFile } from './actions';

import Octicon, { getIconByName } from '@primer/octicons-react';
import {
  Container,
  Button,
  Header,
  Dropdown,
  Form,
  Input,
  Popup,
  Menu,
  Loader,
  Divider,
  Message,
  Breadcrumb
} from 'semantic-ui-react';
import styles from './styles.module.scss';

class CodeTab extends React.Component {
  constructor(props) {
    super(props);
    const { branch } = this.props;
    this.state = {
      branch,
      description: '',
      website: '',
      editingInfo: false,
      infoLoading: true,
      commitCount: 0,
      displayLangs: false
    };
    this.onBranchChange = this.onBranchChange.bind(this);
  }

  async componentDidMount() {
    const { username, reponame, history, match } = this.props;
    const { branch } = this.state;
    this.props.fetchBranches({ owner: username, repoName: reponame });
    const branchNames = await branchesService.getBranches(username, reponame);
    let actualBranch = branch;
    const firstBranch = branchNames.sort()[0];

    if (!branchNames.includes(branch)) {
      actualBranch = firstBranch;
      this.setState({
        branch: firstBranch
      });
    }
    history.push(`/${username}/${reponame}/tree/${actualBranch}`);
    commitsService
      .getCommitCount(username, reponame, actualBranch)
      .then(count => this.setState({ commitCount: count.count }));
    this.props.fetchLastCommitOnBranch({
      username,
      reponame,
      branch: actualBranch
    });

    const defaultPath = `/${username}/${reponame}/tree/${actualBranch}`;
    const pathToDir = match.url
      .replace(`${defaultPath}`, '')
      .replace(`${username}/${reponame}`, '')
      .split('/')
      .filter(path => path)
      .join('/');

    this.props.fetchFileTree({
      username,
      reponame,
      branch: actualBranch,
      query: { pathToDir }
    });
    history.push(`${defaultPath}${pathToDir ? `/${pathToDir}` : ''}`);

    repositoryService.getRepositoryByOwnerAndName({ username, reponame }).then(({ description, website }) => {
      this.setState({ description, website, infoLoading: false });
    });
  }

  infoValidationSchema = Yup.object().shape({
    description: Yup.string(),
    website: Yup.string()
      .url('Invalid URL')
      .max(255)
  });

  onBranchChange = (event, data) => {
    this.setState(
      {
        branch: data.value
      },
      () => {
        const { match, history } = this.props;
        const { username, reponame } = match.params;
        const { branch } = this.state;
        history.push(`/${username}/${reponame}/tree/${data.value}`);

        commitsService
          .getCommitCount(username, reponame, branch)
          .then(count => this.setState({ commitCount: count.count }));
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
    const { description } = this.state;
    const { username, reponame, branch } = match.params;

    this.props.newFile({ filename: 'README.md', content: `# ${reponame}\n\n${description}` });
    history.push(`/${username}/${reponame}/new/${branch}/${currentPath}`);
  };

  onSubmitInfo = ({ description, website }) => {
    const { username: owner, reponame } = this.props.match.params;

    this.setState({ infoLoading: true, editingInfo: false });
    repositoryService
      .updateRepositoryByOwnerAndName({ owner, reponame, request: { description, website } })
      .then(() => this.setState({ infoLoading: false, description, website }));
  };

  toggleEditingDescription = () => {
    this.setState(prevState => ({ editingInfo: !prevState.editingInfo }));
  };

  toggleDisplayLangs = () => {
    this.setState(prevState => ({ displayLangs: !prevState.displayLangs }));
  };

  render() {
    const { branch, description, website, infoLoading, editingInfo, commitCount, displayLangs } = this.state;
    const {
      username,
      currentUser,
      reponame,
      lastCommitData,
      branchesData,
      fileTreeData,
      history,
      fetchFileTree,
      location
    } = this.props;
    const { branches } = branchesData;
    const { files, currentPath } = fileTreeData.tree;
    const readme = files && files.find(file => file.name === 'README.md');
    const branchesCount = branches ? branches.length : 0;

    const languageStats = [
      { id: 'e8ab9bf8-c225-436e-a9a4-9dad1fc2b515',
        percentage: 33.3,
        branchId: '508268e7-476c-4ffb-b1e8-9dbf47c82227',
        languageId: 'b8a93075-20dd-443d-b65d-0166ff5f901d',
        language: { name: 'JavaScript', color: '#f1e05a' } },
      { id: 'e0073072-eb1a-4807-a3be-852845b34393',
        percentage: 16.7,
        branchId: '508268e7-476c-4ffb-b1e8-9dbf47c82227',
        languageId: '51d77e1d-92ef-41e2-a220-64968658f3f6',
        language: { name: 'Ruby', color: '#701516' } },
      { id: '380041db-d39b-4f6d-be5b-4c4b9466b5fa',
        percentage: 16.7,
        branchId: '508268e7-476c-4ffb-b1e8-9dbf47c82227',
        languageId: 'addf16c3-2b00-4f99-bc25-7340b6eb6a6e',
        language: { name: 'CSS', color: '#563d7c' } },
      { id: 'b82d1b6e-a9fc-49d4-89df-7b506772fb35',
        percentage: 16.7,
        branchId: '508268e7-476c-4ffb-b1e8-9dbf47c82227',
        languageId: '3ee2c26a-bc3e-4fa3-a8b3-d72daa3ef203',
        language: { name: 'Python', color: '#3572A5' } },
      { id: '4645105a-790f-4a2f-86ee-0a4206b4cd67',
        percentage: 16.7,
        branchId: '508268e7-476c-4ffb-b1e8-9dbf47c82227',
        languageId: '74f8e4e1-7a37-4ee5-b470-21884ccd8ebe',
        language: { name: 'HTML', color: '#e34c26' } }
    ];



    const rootDir = `/${username}/${reponame}/tree/${branch}`;
    const pathToDir = location.pathname
      .replace(rootDir, '')
      .split('/')
      .filter(path => path);
    const currentDir = pathToDir.pop();
    this.toRootDir = () => {
      history.push(rootDir);
      window.location.reload();
    };

    let readmeSection;
    if (readme) {
      readmeSection = (
        <RepoReadme
          content={readme.content}
          showEdit={currentUser && currentUser === username}
          onReadmeEdit={this.onReadmeEdit}
        />
      );
    } else if (!currentPath && username === currentUser) {
      readmeSection = (
        <Message color="blue" className={styles.readmeTip}>
          Help people interested in this repository understand your project by adding a README.
          <Button className={styles.addReadme} size="small" compact positive onClick={this.onAddReadme}>
            Add a README
          </Button>
        </Message>
      );
    }

    let infoContent, descriptionContent, websiteContent;
    if (!(description || website)) {
      infoContent = <i>No description or website provided</i>;
    } else {
      if (description) {
        descriptionContent = description;
      }
      if (website) {
        websiteContent = (
          <a className={styles.link} href={website}>
            {website}
          </a>
        );
      }
      infoContent = (
        <>
          {descriptionContent}
          {websiteContent}
        </>
      );
    }

    return lastCommitData.loading || fileTreeData.loading || branchesData.loading || infoLoading ? (
      <div>
        <Loader active />
      </div>
    ) : (
      <Container>
        <Divider hidden />
        <div className={styles.repoDescription}>
          {editingInfo ? (
            <Formik
              initialValues={{
                description: description || '',
                website: website || ''
              }}
              validationSchema={this.infoValidationSchema}
              onSubmit={this.onSubmitInfo}
            >
              {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Input
                    name="description"
                    placeholder="Short description"
                    label="Description"
                    error={!!errors.description}
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <InputError name="description" />
                  <Form.Input
                    name="website"
                    placeholder="Website"
                    label="Website"
                    width={7}
                    error={!!errors.website}
                    value={values.website}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <InputError name="website" />
                  <Button type="submit" disabled={errors.description || errors.website} className={styles.actionButton}>
                    Save
                  </Button>
                  <Button onClick={this.toggleEditingDescription} className={styles.actionButton}>
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <div className={styles.repoDescriptionText}>{infoContent}</div>
              {username === currentUser && (
                <Button
                  className={[styles.actionButton, styles.editButton].join(' ')}
                  onClick={this.toggleEditingDescription}
                >
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
        <div>
          <Menu borderless attached="top" widths={4}>
            <Menu.Item>
              <Octicon icon={getIconByName('history')} />
              <Link className={styles.repoMetaDataLinks} to={`/${username}/${reponame}/commits/${branch}`}>
                <b>{commitCount} </b> commits
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
          <div className={styles.languageStatColors} onClick={this.toggleDisplayLangs}>
            {languageStats.map(({ percentage, language: { color }}) => (
              <div key={color} className={styles.languageColorLine} style={{ backgroundColor: color, width: `${percentage}%` }} />
            ))}
          </div>
          {displayLangs && (
            <div className={styles.languageStats}>
              {languageStats.map(({ percentage, language: { name, color } }) => (
                <div key={name} className={styles.languageLegend}>
                  <span className={styles.languageColorDot} style={{ backgroundColor: color }}/>
                  <span className={styles.languageName}>{name}</span>
                  <span>{percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

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
              {currentUser && currentUser === username && (
                <>
                  <Button className={styles.actionButton} onClick={this.onCreateFile}>
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
                  onClick={this.OnDropdownClick}
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
        {currentDir ? (
          <div className={styles.filePathRow}>
            <Breadcrumb size="big" className={styles.filePath}>
              <Breadcrumb.Section>
                <Link to="" onClick={this.toRootDir}>
                  {reponame}
                </Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider />
              <FilePathBreadcrumbSections owner={username} reponame={reponame} branch={branch} filepath={pathToDir} />
              <Breadcrumb.Section>{currentDir}</Breadcrumb.Section>
            </Breadcrumb>
          </div>
        ) : null}
        <RepoFileTree
          lastCommitData={lastCommitData}
          fileTreeData={fileTreeData}
          username={username}
          reponame={reponame}
          branch={branch}
          history={history}
          fetchFileTree={fetchFileTree}
        />
        {readmeSection}
      </Container>
    );
  }
}

const mapStateToProps = ({ lastCommitData, branchesData, fileTreeData, profile }) => ({
  lastCommitData,
  branchesData,
  fileTreeData,
  currentUser: profile.currentUser.username
});

const mapDispatchToProps = {
  fetchLastCommitOnBranch,
  fetchBranches,
  fetchFileTree,
  newFile
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
  newFile: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  match: PropTypes.object,
  currentUser: PropTypes.string,
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CodeTab));
