import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import ReactMarkdown from 'react-markdown';
import { Breadcrumb, Input, Button, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// Modes for code highlighting
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/markdown';

import styles from './styles.module.scss';

class FileEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      filename: props.filename || ''
    };

    this.handleChangeFilename = this.handleChangeFilename.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.selectMode = this.selectMode.bind(this);
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
      return 'markdown';
    default:
      return '';
    }
  }

  render() {
    const { location, match } = this.props;
    const { filename, content } = this.state;

    const filepath = location.pathname
      .replace(match.url, '')
      .split('/')
      .filter(dir => dir) // Remove empty strings
      .slice(1); // Remove branch name

    const fileExtension = filename.split('.').pop();

    const panes = [
      {
        menuItem: 'Edit',
        render: () => (
          <Tab.Pane>
            <AceEditor
              theme="github"
              value={content}
              mode={this.selectMode(fileExtension)}
              className={styles.textEditor}
              onChange={this.handleContentChange}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Preview',
        render: () => {
          if (fileExtension === 'md') {
            return <ReactMarkdown source={content} />;
          }

          return (
            <Tab.Pane>
              <AceEditor
                theme="github"
                readOnly
                value={content}
                mode={this.selectMode(fileExtension)}
                className={styles.textEditor}
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
            <Link to={`${match.url}`}>{match.params.reponame}</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          {filepath.map((directory, index) => (
            <Fragment key={index}>
              <Breadcrumb.Section>
                <Link to={''}>{directory}</Link>
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
        <Tab panes={panes} />
      </>
    );
  }
}

FileEditor.propTypes = {
  filename: PropTypes.string,
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

export default FileEditor;
