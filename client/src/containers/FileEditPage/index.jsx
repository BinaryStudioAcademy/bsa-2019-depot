import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Breadcrumb, Input, Button, Tab, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactDiffViewer from 'react-diff-viewer';
import CommitFileForm from '../../components/CommitFileForm';
import FileViewer from '../../components/FileViewer';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import { getFileContent } from '../../services/branchesService';
import { modifyFile } from '../../services/commitsService';

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

    let filename = '';
    if (match.url.includes('edit')) {
      filename = location.pathname.split('/').pop();
    }

    this.state = {
      fileData: { content: '' },
      oldContent: '',
      filename: filename,
      oldFilename: filename,
      toEdit: !!filename,
      loading: !!filename
    };

    this.handleChangeFilename = this.handleChangeFilename.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCommitFile = this.handleCommitFile.bind(this);
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
    this.setState({ filename: value });
  }

  handleContentChange(content) {
    this.setState({ fileData: { content } });
  }

  handleCancel() {
    const {
      history,
      location: { pathname }
    } = this.props;

    const folderUrl = pathname.replace('/edit', '/tree').replace('/new', '/tree');

    history.push(`${folderUrl}`);
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
      filePathDirs.splice(-1, 1, filename);
      newFilePath = filePathDirs.join('/');
    }

    this.setState({ loading: true });
    modifyFile(ownerUsername, reponame, branch, {
      author: username,
      email,
      message,
      commitBranch,
      oldFilepath: toEdit ? this.filepath : newFilePath,
      filepath: newFilePath,
      fileData: content
    }).then(() => {
      this.handleCancel();
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
      loading
    } = this.state;
    const { username: ownerUsername, reponame, branch } = match.params;

    const filepathDirs = this.filepath.split('/').filter(dir => dir);

    if (match.url.includes('edit')) filepathDirs.pop();
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
      <Loader active inline="centered" />
    ) : (
      <>
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
          <Breadcrumb.Section>
            <Input
              className={styles.fileNameInput}
              value={filename}
              focus
              size="mini"
              placeholder="Name your file..."
              onChange={this.handleChangeFilename}
            />
            <Button className={styles.newButton} basic onClick={this.handleCancel}>
              Cancel
            </Button>
          </Breadcrumb.Section>
        </Breadcrumb>
        <Tab className={styles.editorArea} panes={panes} />
        <CommitFileForm
          avatar={avatar}
          initialBranch={branch}
          disabled={!filename || (content === oldContent && filename === oldFilename && toEdit)}
          onSubmit={this.handleCommitFile}
          onCancel={this.handleCancel}
        />
      </>
    );
  }
}

FileEditPage.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
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
    currentUser: { username, avatar, email }
  }
}) => ({
  username,
  avatar,
  email
});

export default connect(mapStateToProps)(FileEditPage);
