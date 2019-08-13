import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import ReactMarkdown from 'react-markdown';
import { Breadcrumb, Input, Button, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import CommitFileForm from '../../components/CommitFileForm';

// Modes for code highlighting
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/markdown';

import 'brace/theme/github';

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
    this.selectMode = this.selectMode.bind(this);
  }

  componentDidMount() {
    if (this.state.toEdit) {
      // Call server for contents
    }
  }

  handleChangeFilename(event, { value }) {
    this.setState({ filename: value });
  }

  handleContentChange(content) {
    this.setState({ content });
  }

  selectMode(extension) {
    switch (extension) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'java':
      return 'java';
    case 'cs':
      return 'csharp';
    case 'py':
      return 'python';
    case 'rb':
      return 'ruby';
    case 'md':
    default:
      return 'markdown';
    }
  }

  render() {
    const { location, match, username, avatar } = this.props;
    const { filename, content } = this.state;
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
            <AceEditor
              theme="github"
              value={content}
              mode={this.selectMode(fileExtension)}
              style={editorStyles}
              onChange={this.handleContentChange}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Preview',
        render: () => {
          if (fileExtension === 'md') {
            return (
              <Tab.Pane>
                <ReactMarkdown className={styles.markdownContainer} source={content} />
              </Tab.Pane>
            );
          }

          return (
            <Tab.Pane>
              <AceEditor
                theme="github"
                readOnly
                value={content}
                mode={this.selectMode(fileExtension)}
                style={editorStyles}
              />
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
                <Link to={`/${ownerUsername}/${reponame}/tree/${initialBranch}/${array.slice(0, index + 1).join('/')}`}>{directory}</Link>
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
        <CommitFileForm username={username} avatar={avatar} initialBranch={initialBranch}/>
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

const mapStateToProps = ({ profile: { currentUser: { username, avatar } } }) => ({
  username,
  avatar
});

export default connect(mapStateToProps)(FileEditPage);
