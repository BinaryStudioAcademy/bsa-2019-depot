import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import { Table, Image, Message } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';
import moment from 'moment';

class RepoFileTree extends React.Component {
  constructor(props) {
    super(props);
    this.getFolderContent = this.getFolderContent.bind(this);
    this.getLevelUpFolderContent = this.getLevelUpFolderContent.bind(this);
  }

  getFolderContent = e => {
    const { currentPath } = this.props.fileTreeData.tree;
    const { username, reponame, branch, history, fetchFileTree } = this.props;
    e.preventDefault();
    fetchFileTree({
      username,
      reponame,
      branch,
      query: {
        pathToDir: currentPath ? `${currentPath}/${e.target.textContent}` : e.target.textContent
      }
    });
    history.push(`${history.location.pathname}/${e.target.textContent}`);
  };

  getLevelUpFolderContent = e => {
    e.preventDefault();
    const { username, reponame, branch, history, fetchFileTree } = this.props;
    const { parentDir } = this.props.fileTreeData.tree;
    fetchFileTree({
      username,
      reponame,
      branch,
      query: {
        pathToDir: parentDir
      }
    });

    const pathname = history.location.pathname.split('/');
    const newPathName = pathname.slice(0, pathname.length - 1).join('/');
    history.push(newPathName);
  };

  render() {
    const {
      lastCommitData: {
        sha,
        message,
        createdAt,
        user: { username: author }
      },
      fileTreeData: {
        tree: { files, directories, currentPath }
      },
      reponame,
      username,
      location
    } = this.props;
    const lastCommitLink = `/${username}/${reponame}/commit/${sha}`;

    return (
      <div>
        <Message attached="top" info>
          <Link className={styles.commitAuthor} to={`/${username}`}>
            <Image
              width="20"
              height="20"
              src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4"
              spaced="right"
              rounded
            />
            {author}
          </Link>
          <Link className={styles.link} to={lastCommitLink}>
            {message}
          </Link>
          <div className={styles.commit}>
            latest commit
            <Link className={styles.sha} to={lastCommitLink}>
              {sha.slice(0, 8)}
            </Link>
            {moment(createdAt).fromNow()}
          </div>
        </Message>
        <Table attached="bottom" selectable singleLine unstackable>
          <Table.Body>
            {currentPath ? (
              <Table.Row>
                <Table.Cell>
                  <Link className={styles.link} to="" onClick={this.getLevelUpFolderContent}>
                    ..
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ) : null}
            {directories.map((dir, index) => (
              <React.Fragment key={index}>
                <Table.Row>
                  <Table.Cell singleLine width="five">
                    <Octicon className={styles.folderIcon} icon={getIconByName('file-directory')} />
                    <Link className={styles.link} to="" onClick={this.getFolderContent}>
                      {dir.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className={styles.link} to={`/${username}/${reponame}/commit/${dir.sha}`}>
                      {dir.commitMessage}
                    </Link>
                  </Table.Cell>
                  <Table.Cell textAlign="right" collapsing>
                    {moment(dir.time).fromNow()}
                  </Table.Cell>
                </Table.Row>
              </React.Fragment>
            ))}

            {files.map((file, index) => (
              <React.Fragment key={index}>
                <Table.Row>
                  <Table.Cell singleLine width="five">
                    <Octicon className={styles.fileIcon} icon={getIconByName('file')} />
                    <Link className={styles.link} to={`${location.pathname.replace('tree', 'blob')}/${file.name}`}>
                      {file.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className={styles.link} to={`/${username}/${reponame}/commit/${file.sha}`}>
                      {file.commitMessage}
                    </Link>
                  </Table.Cell>
                  <Table.Cell textAlign="right" collapsing>
                    {moment(file.time).fromNow()}
                  </Table.Cell>
                </Table.Row>
              </React.Fragment>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

RepoFileTree.propTypes = {
  lastCommitData: PropTypes.shape({
    sha: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  }).isRequired,
  fileTreeData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    tree: PropTypes.exact({
      files: PropTypes.array.isRequired,
      directories: PropTypes.array.isRequired,
      parentDir: PropTypes.string.isRequired,
      currentPath: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  fetchFileTree: PropTypes.func.isRequired
};

export default withRouter(RepoFileTree);
