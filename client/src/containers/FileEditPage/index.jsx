import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Breadcrumb, Input, Button, Tab, Loader, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactDiffViewer from 'react-diff-viewer';
import CommitFileForm from '../../components/CommitFileForm';
import FileViewer from '../../components/FileViewer';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import { getFileContent } from '../../services/branchesService';
import { modifyFile } from '../../services/commitsService';
import { checkFilename } from '../../services/branchesService';

import styles from './styles.module.scss';

class FileEditPage extends React.Component {
  constructor(props) {
    super(props);

    const { location, match } = props;
    this.filepath = location.pathname
      .replace(`${match.url}`, '')
      .split('/')
      .filter(dir => dir)
      .join('/');

    const toEdit = match.url.includes('edit');
    let filename, content;
    if (toEdit) {
      filename = location.pathname.split('/').pop();
    }
    if (match.url.includes('new')) {
      filename = props.filename || '';
      content = props.content || '';
    }

    this.state = {
      fileData: { content },
      oldContent: content,
      filename: filename,
      oldFilename: filename,
      toEdit,
      loading: toEdit,
      isFilenameUnique: true,
      checkFilenameTimer: null,
      checkingFilename: false
    };

    this.handleChangeFilename = this.handleChangeFilename.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCommitFile = this.handleCommitFile.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    if (this.state.toEdit) {
      const { username, reponame, branch } = this.props.match.params;

      getFileContent(username, reponame, branch, {
        filepath: this.filepath
      }).then(fileData =>
        this.setState({
          fileData,
          oldContent: fileData.content,
          loading: false
        })
      );
    }
  }

  handleChangeFilename(event, { value }) {
    this.setState({ filename: value }, () => {
      if (!this.state.toEdit) {
        this.checkFilenameExist();
      }
    });
  }

  handleContentChange(content) {
    this.setState({ fileData: { content } });
  }

  handleCancel(filepath = '', commitBranch = '') {
    window.location.href = this.mapRedirectPath(filepath, commitBranch);
  }

  mapRedirectPath(filepath = '', commitBranch = '') {
    const { username, reponame } = this.props.match.params;
    const replaceHandler = g1 => (g1 === '/new/' ? '/tree/' : '/blob/');
    return typeof filepath === 'string'
      ? `${window.location.origin}/${username}/${reponame}/blob/${commitBranch}${filepath ? `/${filepath}` : ''}`
      : `${window.location.origin}${this.props.location.pathname.replace(/\/edit\/|\/new\/{0,1}/, replaceHandler)}`;
  }

  handleCommitFile({ message, commitBranch }) {
    const { username: ownerUsername, reponame, branch } = this.props.match.params;
    const {
      filename,
      toEdit,
      fileData: { content }
    } = this.state;
    const { email, username } = this.props;
    let newFilePath;
    if (!toEdit) {
      newFilePath = `${this.filepath ? this.filepath + '/' : ''}${filename.trim()}`;
    } else {
      const filePathDirs = this.filepath.split('/');
      filePathDirs.splice(-1, 1, filename); // Replace old filename with new
      newFilePath = filePathDirs.join('/');
    }

    this.setState({ loading: true });
    modifyFile(ownerUsername, reponame, branch, {
      author: username,
      email,
      message: message.trim(),
      commitBranch,
      oldFilepath: toEdit ? this.filepath : newFilePath, // Otherwise our old filepath would be path to folder
      filepath: newFilePath,
      fileData: content
    })
      .then(() => {
        this.handleCancel(newFilePath, commitBranch);
      })
      .catch(() => {
        this.handleCancel();
      });
  }

  checkFilenameExist() {
    if (!this.state.checkFilenameTimer) {
      const { username, reponame, branch } = this.props.match.params;
      const { filename } = this.state;

      const resetTimer = () => {
        clearTimeout(this.state.checkFilenameTimer);
        this.setState({ checkFilenameTimer: null });
      };

      this.setState({ checkingFilename: true });
      checkFilename(username, reponame, branch, {
        filepath: `${this.filepath}${this.filepath ? '/' : ''}${filename.trim()}`
      }).then(({ isFilenameUnique }) => {
        this.setState({
          isFilenameUnique,
          checkingFilename: false,
          checkFilenameTimer: setTimeout(resetTimer, 500)
        });
      });
    }
  }

  handleBlur() {
    const { username, reponame, branch } = this.props.match.params;
    const { filename } = this.state;

    this.setState({ checkingFilename: true });
    checkFilename(username, reponame, branch, {
      filepath: `${this.filepath}${this.filepath ? '/' : ''}${filename.trim()}`
    }).then(({ isFilenameUnique }) => {
      this.setState({
        isFilenameUnique,
        checkingFilename: false
      });
    });
  }

  render() {
    const { match, avatar } = this.props;
    const {
      fileData: { content },
      oldContent,
      filename,
      oldFilename,
      toEdit,
      loading,
      isFilenameUnique,
      checkingFilename
    } = this.state;
    const { username: ownerUsername, reponame, branch } = match.params;

    const filepathDirs = this.filepath.split('/').filter(dir => dir);

    if (toEdit) filepathDirs.pop();
    const fileExtension = filename.split('.').pop();

    const editorStyles = { width: '100%' };
    const panes = [
      {
        menuItem: 'Edit',
        render: () => (
          <Tab.Pane>
            <FileViewer
              content={content}
              style={editorStyles}
              fileExtension={fileExtension}
              onChange={this.handleContentChange}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Preview',
        render: () => {
          if (toEdit) {
            return (
              <Tab.Pane>
                <ReactDiffViewer
                  oldValue={oldContent}
                  newValue={content}
                  splitView={false}
                  showDiffOnly={false}
                  styles={{ gutter: { width: '25px' } }}
                />
              </Tab.Pane>
            );
          }
          if (fileExtension === 'md') {
            return (
              <Tab.Pane>
                <ReactMarkdown className={styles.markdownContainer} source={content} />
              </Tab.Pane>
            );
          }

          return (
            <Tab.Pane>
              <FileViewer content={content} style={editorStyles} readOnly />
            </Tab.Pane>
          );
        }
      }
    ];

    return loading ? (
      <Loader active />
    ) : (
      <Segment basic>
        <Breadcrumb size="big" className={styles.filePath}>
          <Breadcrumb.Section>
            <Link to={`/${ownerUsername}/${reponame}`}>{reponame}</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <FilePathBreadcrumbSections
            owner={ownerUsername}
            reponame={reponame}
            branch={branch}
            filepath={filepathDirs}
          />
          <Breadcrumb.Section className={styles.fileNameSection}>
            <Input
              className={styles.fileNameInput}
              value={filename}
              focus
              size="mini"
              placeholder="Name your file..."
              error={!isFilenameUnique}
              onChange={this.handleChangeFilename}
              onBlur={this.handleBlur}
            />
            <Button className={styles.newButton} basic onClick={this.handleCancel}>
              Cancel
            </Button>
            {!isFilenameUnique && <div className={styles.error_wrapper}>A file with the same name already exists</div>}
          </Breadcrumb.Section>
        </Breadcrumb>
        <Tab className={styles.editorArea} panes={panes} />
        <CommitFileForm
          avatar={avatar}
          initialBranch={branch}
          disabled={
            !filename ||
            (content === oldContent && filename === oldFilename && toEdit) ||
            checkingFilename ||
            !isFilenameUnique
          }
          onSubmit={this.handleCommitFile}
          onCancel={this.handleCancel}
        />
      </Segment>
    );
  }
}

FileEditPage.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  email: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.exact({
    key: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { username, avatar, email }
  },
  newFile: { filename, content }
}) => ({
  username,
  avatar,
  email,
  filename,
  content
});

export default connect(mapStateToProps)(FileEditPage);
