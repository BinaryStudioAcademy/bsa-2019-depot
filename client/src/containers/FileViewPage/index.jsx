import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Breadcrumb, Button, Icon, Loader, Segment } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import FileViewer from '../../components/FileViewer';
import { Link } from 'react-router-dom';
import { getFileContent } from '../../services/branchesService';
import { modifyFile } from '../../services/commitsService';
import { rawServerUrl } from '../../app.config';
import { getWriteUserPermissions } from '../../helpers/checkPermissionsHelper';

import styles from './styles.module.scss';

class FileViewPage extends React.Component {
  constructor(props) {
    super(props);

    const { match, location } = this.props;
    this.filepath = location.pathname.replace(`${match.url}/`, '');

    this.state = {
      fileData: {},
      loading: true,
      deleting: false,
      isAccessGranted: false
    };

    this.handleCopyPath = this.handleCopyPath.bind(this);
    this.handleOpenRaw = this.handleOpenRaw.bind(this);
    this.handleEditFile = this.handleEditFile.bind(this);
    this.handleBlameFile = this.handleBlameFile.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
  }

  async componentDidMount() {
    const { username, reponame, branch } = this.props.match.params;
    const { userId } = this.props;
    getFileContent(username, reponame, branch, {
      filepath: this.filepath
    }).then(fileData =>
      this.setState({
        fileData,
        loading: false
      })
    );

    const isAccessGranted = await getWriteUserPermissions(username, reponame, userId);
    this.setState({
      isAccessGranted
    });
  }

  handleCopyPath() {
    navigator.clipboard.writeText(this.filepath);
  }

  handleOpenRaw() {
    const { match } = this.props;
    const { username, reponame, branch } = match.params;

    window.location.replace(
      `${rawServerUrl}/${username}/${reponame}/${branch}/${this.filepath}?token=${localStorage.getItem('token')}`
    );
  }

  handleEditFile() {
    const { history, location } = this.props;

    history.push(location.pathname.replace('/blob', '/edit'));
  }

  handleBlameFile() {
    const { history, location } = this.props;

    history.push(location.pathname.replace('/blob', '/blame'));
  }

  handleDeleteFile() {
    const { history, match, username: author, email } = this.props;
    const { username: owner, reponame: repoName, branch } = match.params;

    this.setState({ deleting: true });
    modifyFile(owner, repoName, branch, {
      author,
      email,
      filepath: this.filepath,
      toDelete: true
    }).then(() => {
      this.setState({ deleting: false });
      history.push(
        `/${owner}/${repoName}/tree/${branch}/${this.filepath
          .split('/')
          .slice(0, -1)
          .join('/')}`
      );
    });
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    if (bytes === 1) return '1 Byte';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  render() {
    const { match, location, username } = this.props;
    const {
      fileData: { content, size },
      loading,
      deleting,
      isAccessGranted
    } = this.state;
    const { username: owner, reponame, branch } = match.params;
    const editorStyles = { width: '100%' };

    let filepathDirs, filename, fileExtension, lineCount;
    if (!loading) {
      filepathDirs = this.filepath.split('/').slice(0, -1); // Remove file name
      filename = location.pathname.split('/').pop();
      fileExtension = filename.split('.').pop();
      lineCount = content.split('\n').length;
    }

    return loading || deleting ? (
      <Loader active />
    ) : (
      <Segment basic>
        <div className={styles.filePathRow}>
          <Breadcrumb size="big" className={styles.filePath}>
            <Breadcrumb.Section>
              <Link to={`/${owner}/${reponame}/tree/${branch}`}>{reponame}</Link>
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <FilePathBreadcrumbSections owner={owner} reponame={reponame} branch={branch} filepath={filepathDirs} />
            <Breadcrumb.Section>{filename}</Breadcrumb.Section>
          </Breadcrumb>
          <Button
            compact
            size="small"
            className={[styles.copyButton, styles.actionButton].join(' ')}
            onClick={this.handleCopyPath}
          >
            Copy path
          </Button>
        </div>
        <Segment.Group className={styles.fileViewContainer}>
          <Segment className={styles.fileViewHeader}>
            <div className={styles.fileInfo}>
              <code className={styles.lineCount}>{lineCount} lines</code>
              <code>{this.formatBytes(size)}</code>
            </div>
            <div className={styles.fileControls}>
              <Button
                compact
                size="small"
                className={[styles.rawButton, styles.actionButton].join(' ')}
                onClick={this.handleOpenRaw}
              >
                Raw
              </Button>
              <Button
                compact
                size="small"
                className={[styles.rawButton, styles.actionButton].join(' ')}
                onClick={this.handleBlameFile}
              >
                Blame
              </Button>
              {((username && username === owner) || isAccessGranted) && (
                <>
                  <Icon link name="pencil" onClick={this.handleEditFile} />
                  <Icon link name="trash alternate" onClick={this.handleDeleteFile} />
                </>
              )}
            </div>
          </Segment>
          <Segment className={styles.fileView}>
            {fileExtension === 'md' ? (
              <ReactMarkdown className={styles.markdownContainer} source={content} />
            ) : (
              <FileViewer content={content} style={editorStyles} fileExtension={fileExtension} readOnly />
            )}
          </Segment>
        </Segment.Group>
      </Segment>
    );
  }
}

FileViewPage.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
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
    currentUser: { username, email, id: userId }
  }
}) => ({
  username,
  email,
  userId
});

export default connect(mapStateToProps)(FileViewPage);
