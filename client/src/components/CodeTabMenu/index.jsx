import React from 'react';
import { Link } from 'react-router-dom';
import Octicon, { getIconByName } from '@primer/octicons-react';
import { Segment, Menu } from 'semantic-ui-react';

import styles from './styles.module.scss';

const CodeTabMenu = ({
  ownername,
  reponame,
  branch,
  branchesCount,
  commitsCount
}) => (
  <>
    <Menu borderless attached="top" widths={4}>
      <Menu.Item>
        <Octicon icon={getIconByName('history')} />
        <Link className={styles.repoMetaDataLinks} to={`/${ownername}/${reponame}/commits/${branch}`}>
          <b>{commitsCount}</b> commits
              </Link>
      </Menu.Item>
      <Menu.Item>
        <Octicon icon={getIconByName('git-branch')} />
        <Link className={styles.repoMetaDataLinks} to={`/${ownername}/${reponame}/branches`}>
          <b>{branchesCount}</b> branches
              </Link>
      </Menu.Item>
      <Menu.Item>
        <Octicon icon={getIconByName('tag')} />
        <Link className={styles.repoMetaDataLinks} to="">
          <b>77</b> releases
              </Link>
      </Menu.Item>
      <Menu.Item>
        <Octicon icon={getIconByName('organization')} />
        <Link className={styles.repoMetaDataLinks} to="">
          <b>10</b> contributors
              </Link>
      </Menu.Item>
    </Menu>
    <Segment.Group className={styles.languageSegments} attached="bottom" horizontal>
      <Segment className={styles.languageSegment} inverted color="yellow" />
      <Segment className={styles.languageSegment} inverted color="purple" />
      <Segment className={styles.languageSegment} inverted color="red" />
    </Segment.Group>
  </>
)

export default CodeTabMenu;
