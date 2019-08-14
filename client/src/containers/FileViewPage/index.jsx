import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Button, Icon, Segment } from 'semantic-ui-react';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import FileViewer from '../../components/FileViewer';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

class FileViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    };

    this.handleCopyPath = this.handleCopyPath.bind(this);
    this.handleEditFile = this.handleEditFile.bind(this);
  }

  componentDidMount() {
    // Fetch file content
    // Mocks
    const content = `actionmailer (5.0.0)
actionpack (= 5.0.0)
actionview (= 5.0.0)
activejob (= 5.0.0)
mail (~> 2.5, >= 2.5.4)
rails-dom-testing (~> 2.0)`;
    this.setState({ content });
  }

  handleCopyPath() {
    const { match, location } = this.props;

    const filepath = location.pathname
      .replace(match.url, '')
      .split('/')
      .filter(dir => dir)
      .slice(1)
      .join('/');

    navigator.clipboard.writeText(filepath);
  }

  handleEditFile() {
    const { history, location } = this.props;

    history.push(location.pathname.replace('/blob', '/edit/tree'));
  }

  render() {
    const { match, location } = this.props;
    const { content } = this.state;
    const { username: owner, reponame } = match.params;
    const editorStyles = { width: '100%' };

    const baseUrlExtension = location.pathname
      .replace(match.url, '')
      .split('/')
      .filter(dir => dir); // Remove empty strings

    const branch = baseUrlExtension[0];
    const filepath = baseUrlExtension.slice(1, -1); // Remove branch and file name
    const filename = location.pathname.split('/').pop();
    const fileExtension = filename.split('.').pop();
    const lineCount = content.split('\n').length;

    return (
      <>
        <div className={styles.filePathRow}>
          <Breadcrumb size="big" className={styles.filePath}>
            <Breadcrumb.Section>
              <Link to={`/${owner}/${reponame}`}>{reponame}</Link>
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <FilePathBreadcrumbSections owner={owner} reponame={reponame} branch={branch} filepath={filepath} />
            <Breadcrumb.Section>{filename}</Breadcrumb.Section>
          </Breadcrumb>
          <Button compact size="small" className={styles.copyButton} onClick={this.handleCopyPath}>
            Copy path
          </Button>
        </div>
        <Segment.Group className={styles.fileViewContainer}>
          <Segment className={styles.fileViewHeader}>
            <div>
              <code>{lineCount} lines</code>
            </div>
            <div className={styles.fileControls}>
              <Icon link name="pencil" onClick={this.handleEditFile} />
              <Icon link name="trash alternate" />
            </div>
          </Segment>
          <Segment className={styles.fileView}>
            <FileViewer content={content} style={editorStyles} fileExtension={fileExtension} readOnly />
          </Segment>
        </Segment.Group>
      </>
    );
  }
}

FileViewPage.propTypes = {
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

export default FileViewPage;
