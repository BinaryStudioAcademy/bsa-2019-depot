import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

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
          <Link to={baseUrl} className={getClassName('overview', activeTab)}>
            Overview
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=repositories`} className={getClassName('repositories', activeTab)}>
            Repositories{repoCount && <span>{repoCount}</span>}
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=projects`} className={getClassName('projects', activeTab)}>
            Projects{projectsCount && <span>{projectsCount}</span>}
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=stars`} className={getClassName('stars', activeTab)}>
            Stars{starsCount && <span>{starsCount}</span>}
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=followers`} className={getClassName('followers', activeTab)}>
            Followers{followersCount && <span>{followersCount}</span>}
          </Link>
        </li>
        <li>
          <Link to={`${baseUrl}?tab=following`} className={getClassName('followers', activeTab)}>
            Following{followingCount && <span>{followingCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  )
};

DashboardHeader.propTypes = {
  repoCount: PropTypes.array,
  projectsCount: PropTypes.number,
  starsCount: PropTypes.number,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
  baseUrl: PropTypes.string,
  activeTab: PropTypes.string
};

export default DashboardHeader;
