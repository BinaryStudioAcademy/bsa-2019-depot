import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export const tabs = {
  overview: 'overview',
  repositories: 'repositories',
  stars: 'stars'
};

const DashboardHeader = ({ repoCount, starsCount, baseUrl, activeTab }) => {
  const getClassName = (tab, activeTab) => {
    if (!activeTab && tab === 'overview') {
      return 'dashboard_link selected';
    }

    return tab === activeTab ? 'dashboard_link selected' : 'dashboard_link';
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar_list}>
        <li>
          <Link to={baseUrl} className={getClassName(tabs.overview, activeTab)}>
            <span className={styles.tabName}>Overview</span>
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=repositories`} className={getClassName(tabs.repositories, activeTab)}>
            <span className={styles.tabName}>Repositories</span>
            <span>{repoCount || 0}</span>
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=stars`} className={getClassName(tabs.stars, activeTab)}>
            <span className={styles.tabName}>Stars</span>
            <span>{starsCount || 0}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

DashboardHeader.propTypes = {
  repoCount: PropTypes.string,
  starsCount: PropTypes.string,
  baseUrl: PropTypes.string,
  activeTab: PropTypes.string
};

export default DashboardHeader;
