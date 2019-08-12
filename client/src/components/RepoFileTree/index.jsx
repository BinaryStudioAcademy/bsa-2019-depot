import React from 'react';
import { Link } from 'react-router-dom';

import { Table, Image, Message } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';

const RepoFileTree = () => {
  return (
    <div>
      <Message attached="top" info>
        <div className={styles.commit}>
          latest commit{' '}
          <Link className={styles.sha} to="">
            c95a1de{' '}
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
          author{' '}
        </Link>
        <Link className={styles.link} to="">
          Merge pull request{' '}
        </Link>
        <Link className={styles.prNumber} to="">
          #2728
        </Link>{' '}
        <Link className={styles.link} to="">
          from new/patch-1{' '}
        </Link>
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
            <Table.Cell>
              <Link className={styles.link} to="">
                Build 2.0.7
              </Link>
            </Table.Cell>
            <Table.Cell textAlign="right" collapsing>
              4 days ago
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell singleLine width="five">
              <Octicon className={styles.folderIcon} icon={getIconByName('file-directory')} />
              <Link className={styles.link} to="">
                src
              </Link>
            </Table.Cell>
            <Table.Cell>
              <Link className={styles.link} to="">
                Updated browser prefix config
              </Link>
            </Table.Cell>
            <Table.Cell textAlign="right" collapsing>
              5 days ago
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell singleLine width="five">
              <Octicon className={styles.fileIcon} icon={getIconByName('file')} />
              <Link className={styles.link} to="">
                .csscomb.json
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
        </Table.Body>
      </Table>
    </div>
  );
};

export default RepoFileTree;
