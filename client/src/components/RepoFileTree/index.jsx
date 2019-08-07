import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Button, Table, Segment, Image, Message, Header, List } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';

const RepoFileTree = () => (
    <Container>
        <div className={styles.repoNav}>
            <div>
                <Button className={[styles.actionButton, styles.repoBranchesButton]}>Branch: master</Button>
                <Button className={styles.actionButton}>New pull request</Button>
            </div>
            <div>
                <Button.Group className={styles.repoActions}>
                    <Button className={styles.actionButton}>Create New File</Button>
                    <Button className={styles.actionButton}>Upload files</Button>
                    <Button className={styles.actionButton}>Find file</Button>
                </Button.Group>
                <Button className={[styles.actionButton, styles.cloneRepoButton]}>Clone or download</Button>
            </div>
        </div>

        <Message attached="top" info className={styles.lastCommitMessage}>
            <div className={styles.commit}>
        latest commit
                <Link className={styles.sha} to="">
          c95a1de
                </Link>
        3 hours ago
            </div>
            <Image
                width="20"
                height="20"
                src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4"
                spaced="right"
                rounded
            />
            <Link className={styles.commitAuthor} to="">
        author
            </Link>
      Merge pull request{' '}
            <Link className={styles.prNumber} to="">
        #2728
            </Link>{' '}
      from new/patch-1
        </Message>
        <Table attached="bottom" selectable singleLine unstackable>
            <Table.Body>
                <Table.Row>
                    <Table.Cell singleLine width="five">
                        <Octicon className={styles.folderIcon} icon={getIconByName('file-directory')} />
                        <Link className={styles.link} to="">
              dist
                        </Link>
                    </Table.Cell>
                    <Table.Cell>Build 2.0.7</Table.Cell>
                    <Table.Cell textAlign="right" collapsing>
            4 days ago
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell singleLine width="five">
                        <Octicon className={styles.folderIcon} icon={getIconByName('file-directory')} />
                        <Link to="">src</Link>
                    </Table.Cell>
                    <Table.Cell>Updated browser prefix config</Table.Cell>
                    <Table.Cell textAlign="right" collapsing>
            5 days ago
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell singleLine width="five">
                        <Octicon className={styles.fileIcon} icon={getIconByName('file')} />
                        <Link to="">.csscomb.json</Link>
                    </Table.Cell>
                    <Table.Cell>Iteration on regex for comment replacemen</Table.Cell>
                    <Table.Cell textAlign="right" collapsing>
            6 days ago
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
        <Segment.Group>
            <Header className={styles.readmeHeader} as="h4" attached="top" block>
                <div>
                    <Octicon icon={getIconByName('book')} />
          README.md
                </div>
                <Octicon icon={getIconByName('pencil')} />
            </Header>
            <Segment padded>
                <h1>Semantic UI</h1>
                <p>Semantic is a UI framework designed for theming.</p>
                <p>Key Features</p>
                <List bulleted>
                    <List.Item>50+ UI elements</List.Item>
                    <List.Item>3000 + CSS variables</List.Item>
                    <List.Item>3 Levels of variable inheritance (similar to SublimeText)</List.Item>
                    <List.Item>Built with EM values for responsive design</List.Item>
                    <List.Item>Flexbox friendly</List.Item>
                </List>
            </Segment>
        </Segment.Group>
    </Container>
);

export default RepoFileTree;
