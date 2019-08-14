import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Breadcrumb, Input, Button, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactDiffViewer from 'react-diff-viewer';
import CommitFileForm from '../../components/CommitFileForm';
import FileViewer from '../../components/FileViewer';

import styles from './styles.module.scss';

class FileEditPage extends React.Component {
  constructor(props) {
    super(props);

    const { location, match } = props;

    let filename = '';
    if (match.path.split('/').pop() === 'edit') {
      filename = location.pathname.split('/').slice(-1)[0];
    }

    this.state = {
      content: '',
      filename: filename,
      toEdit: !!filename
    };

    this.handleChangeFilename = this.handleChangeFilename.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  componentDidMount() {
    if (this.state.toEdit) {
      // Mocks
      const content = `actionmailer (5.0.0)
actionpack (= 5.0.0)
actionview (= 5.0.0)
activejob (= 5.0.0)
mail (~> 2.5, >= 2.5.4)
rails-dom-testing (~> 2.0)`;
      this.setState({ content, oldContent: content });
      // Call server for contents
    }
  }

  handleChangeFilename(event, { value }) {
    this.setState({ filename: value });
  }

  handleContentChange(content) {
    this.setState({ content });
  }

  render() {
    const { location, match, username, avatar } = this.props;
    const { filename, oldContent, content, toEdit } = this.state;
    const { username: ownerUsername, reponame } = match.params;

    const baseUrlExtension = location.pathname
      .replace(match.url, '')
      .split('/')
      .filter(dir => dir); // Remove empty strings

    const initialBranch = baseUrlExtension[1]; // Get branch name from /tree/branchName/...
    const filepath = baseUrlExtension.slice(2); // Remove /tree/branchName

    if (match.url.split('/').pop() === 'edit') filepath.pop();

    const fileExtension = filename.split('.').pop();

    const editorStyles = { width: '100%', height: '400px' };

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
              <FileViewer content={content} style={editorStyles} onChange={this.handleContentChange} readOnly />
            </Tab.Pane>
          );
        }
      }
    ];

    return (
      <>
        <Breadcrumb size="massive">
          <Breadcrumb.Section>
            <Link to={`/${ownerUsername}/${reponame}`}>{match.params.reponame}</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          {filepath.map((directory, index, array) => (
            <Fragment key={index}>
              <Breadcrumb.Section>
                <Link to={`/${ownerUsername}/${reponame}/tree/${initialBranch}/${array.slice(0, index + 1).join('/')}`}>
                  {directory}
                </Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider />
            </Fragment>
          ))}
          <Breadcrumb.Section>
            <Input
              className={styles.fileNameInput}
              value={filename}
              focus
              size="mini"
              placeholder="Name your file..."
              onChange={this.handleChangeFilename}
            />
            <Button className={styles.newButton} basic>
              Cancel
            </Button>
          </Breadcrumb.Section>
        </Breadcrumb>
        <Tab className={styles.editorArea} panes={panes} />
        <CommitFileForm username={username} avatar={avatar} initialBranch={initialBranch} />
      </>
    );
  }
}

FileEditPage.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
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
    currentUser: { username, avatar }
  }
}) => ({
  username,
  avatar
});

export default connect(mapStateToProps)(FileEditPage);
