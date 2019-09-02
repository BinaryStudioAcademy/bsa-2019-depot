import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Octicon, { getIconByName } from '@primer/octicons-react';
import { Menu } from 'semantic-ui-react';
import LanguageStats from '../../containers/LanguageStats';

import styles from './styles.module.scss';

const CodeTabMenu = ({ ownername, reponame, branch, branchesCount, commitsCount }) => (
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
    <LanguageStats branch={branch} />
  </>
);

CodeTabMenu.propTypes = {
  ownername: PropTypes.string,
  reponame: PropTypes.string,
  branch: PropTypes.string,
  branchesCount: PropTypes.number,
  commitsCount: PropTypes.number
};

export default CodeTabMenu;
