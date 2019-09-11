import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Octicon, { getIconByName } from '@primer/octicons-react';
import { Menu } from 'semantic-ui-react';
import LanguageStats from '../../containers/LanguageStats';

import styles from './styles.module.scss';

const CodeTabMenu = ({ ownername, reponame, branch, branchesCount, commitsCount, contributorsCount }) => (
  <>
    <Menu borderless attached="top" widths={3}>
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
        <Octicon icon={getIconByName('organization')} />
        <Link className={styles.repoMetaDataLinks} to={`/${ownername}/${reponame}/insights/contributors`}>
          <b>{contributorsCount}</b> contributors
        </Link>
      </Menu.Item>
    </Menu>
    <LanguageStats branch={branch} />
  </>
);

CodeTabMenu.propTypes = {
  ownername: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  branchesCount: PropTypes.number.isRequired,
  commitsCount: PropTypes.number.isRequired,
  contributorsCount: PropTypes.string.isRequired
};

export default CodeTabMenu;
