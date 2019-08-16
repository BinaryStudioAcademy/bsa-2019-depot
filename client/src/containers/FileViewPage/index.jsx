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

import styles from './styles.module.scss';

class FileViewPage extends React.Component {
  constructor(props) {
    super(props);

    const { match, location } = this.props;
    const urlExtension = location.pathname
      .replace(match.url, '')
      .split('/')
      .filter(dir => dir);

    this.filepath = urlExtension
      .slice(1) // Remove branch name
      .join('/');

    this.branch = urlExtension[0];

    this.state = {
      fileData: {},
      loading: true,
      deleting: false
    };

    this.handleCopyPath = this.handleCopyPath.bind(this);
    this.handleEditFile = this.handleEditFile.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
  }

  componentDidMount() {
    const { username, reponame } = this.props.match.params;
    getFileContent(username, reponame, this.branch, {
      filepath: this.filepath
    }).then(fileData =>
      this.setState({
        fileData,
        loading: false
      })
    );
  }

  handleCopyPath() {
    navigator.clipboard.writeText(this.filepath);
  }

  handleEditFile() {
    const { history, location } = this.props;

    history.push(location.pathname.replace('/blob', '/edit/tree'));
  }

  handleDeleteFile() {
    const { history, match, username: author, email } = this.props;
    const { username: owner, reponame: repoName } = match.params;

    this.setState({ deleting: true });
    modifyFile(owner, repoName, this.branch, {
      author,
      email,
      filepath: this.filepath,
      toDelete: true
    }).then(() => {
      this.setState({ deleting: false });
      history.push(
        `/${owner}/${repoName}/tree/${this.branch}/${this.filepath
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
    const { match, location } = this.props;
    const {
      fileData: { content, size },
      loading,
      deleting
    } = this.state;
    const { username: owner, reponame } = match.params;
    const editorStyles = { width: '100%' };

    let filepathDirs, filename, fileExtension, lineCount;
    if (!loading) {
      filepathDirs = this.filepath.split('/').slice(0, -1); // Remove file name
      filename = location.pathname.split('/').pop();
      fileExtension = filename.split('.').pop();
      lineCount = content.split('\n').length;
    }

    return loading || deleting ? (
      <Loader active inline="centered" />
    ) : (
      <>
        <div className={styles.filePathRow}>
          <Breadcrumb size="big" className={styles.filePath}>
            <Breadcrumb.Section>
              <Link to={`/${owner}/${reponame}`}>{reponame}</Link>
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <FilePathBreadcrumbSections
              owner={owner}
              reponame={reponame}
              branch={this.branch}
              filepath={filepathDirs}
            />
            <Breadcrumb.Section>{filename}</Breadcrumb.Section>
          </Breadcrumb>
          <Button compact size="small" className={styles.copyButton} onClick={this.handleCopyPath}>
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
              <Icon link name="pencil" onClick={this.handleEditFile} />
              <Icon link name="trash alternate" onClick={this.handleDeleteFile} />
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
      </>
    );
  }
}

FileViewPage.propTypes = {
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
    currentUser: { username, email }
  }
}) => ({
  username,
  email
});

export default connect(mapStateToProps)(FileViewPage);
