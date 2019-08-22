import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export const tabs = {
  overview: 'overview',
  repositories: 'repositories',
  projects: 'projects',
  stars: 'stars',
  followers: 'followers',
  following: 'following'
};

const DashboardHeader = ({
  repoCount,
  projectsCount,
  starsCount,
  followersCount,
  followingCount,
  baseUrl,
  activeTab
}) => {
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
            Overview
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=repositories`} className={getClassName(tabs.repositories, activeTab)}>
            Repositories<span>{repoCount || 0}</span>
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=projects`} className={getClassName(tabs.projects, activeTab)}>
            Projects<span>{projectsCount || 0}</span>
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=stars`} className={getClassName(tabs.stars, activeTab)}>
            Stars<span>{starsCount || 0}</span>
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=followers`} className={getClassName(tabs.followers, activeTab)}>
            Followers<span>{followersCount || 0}</span>
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=following`} className={getClassName(tabs.following, activeTab)}>
            Following<span>{followingCount || 0}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

DashboardHeader.propTypes = {
  repoCount: PropTypes.string,
  projectsCount: PropTypes.string,
  starsCount: PropTypes.string,
  followersCount: PropTypes.string,
  followingCount: PropTypes.string,
  baseUrl: PropTypes.string,
  activeTab: PropTypes.string
};

export default DashboardHeader;
