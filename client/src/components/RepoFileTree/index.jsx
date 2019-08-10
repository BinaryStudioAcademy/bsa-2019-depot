import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Table, Image, Message, Dimmer, Loader } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';
import moment from 'moment';

const RepoFileTree = (props) => {
    const { sha, message, author, date } = props.lastCommitData.commit;
    const { files, directories } = props.fileTreeData.tree;
    return (props.lastCommitData.loading && props.fileTreeData.loading
        ? (
            <div>
                <Dimmer active >
                    <Loader />
                </Dimmer>
            </div>
        )
        : (
            < div >
                <Message attached="top" info>
                    <div className={styles.commit}>
                        latest commit{' '}
                        <Link className={styles.sha} to="">
                            {sha.slice(0, 8)}{' '}
                        </Link>
                        {moment(date).fromNow()}
                    </div>
                    <Image
                        width="20"
                        height="20"
                        src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4"
                        spaced="right"
                        rounded
                    />
                    <Link className={styles.commitAuthor} to="">
                        {author}{' '}
                    </Link>
                    <Link className={styles.link} to="">
                        {message}{' '}
                    </Link>
                    {/* <Link className={styles.prNumber} to="">
                    #2728
                </Link>{' '}
                <Link className={styles.link} to="">
                    from new/patch-1{' '}
                </Link> */}
                </Message>
                <Table attached="bottom" selectable singleLine unstackable>
                    <Table.Body>
                        {directories.map((dir, index) => (
                            <React.Fragment key={index}>
                                <Table.Row>
                                    <Table.Cell singleLine width="five">
                                        <Octicon className={styles.folderIcon} icon={getIconByName('file-directory')} />
                                        <Link className={styles.link} to="">
                                            {dir.name}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className={styles.link} to="">
                                        Build 2.0.7
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell textAlign="right" collapsing>
                                    4 days ago
                                    </Table.Cell>
                                </Table.Row>
                            </React.Fragment>    
                        ))}

                        {files.map((file, index) => (
                            <React.Fragment key={index}>
                                <Table.Row>
                                    <Table.Cell singleLine width="five">
                                        <Octicon className={styles.fileIcon} icon={getIconByName('file')} />
                                        <Link className={styles.link} to="">
                                            {file.name}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className={styles.link} to="">
                                    Iteration on regex for comment replacemen
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell textAlign="right" collapsing>
                                6 days ago
                                    </Table.Cell>
                                </Table.Row>
                            </React.Fragment>    
                        ))}

              
                    </Table.Body>
                </Table>
            </div >
        )
    );
};

RepoFileTree.propTypes = {
    lastCommitData: PropTypes.exact({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        commit: PropTypes.exact({
            sha: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired
        })
    }).isRequired,
    fileTreeData: PropTypes.exact({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        tree: PropTypes.exact({
            files: PropTypes.array.isRequired,
            directories: PropTypes.array.isRequired,
        })
    }).isRequired
};

export default RepoFileTree;
