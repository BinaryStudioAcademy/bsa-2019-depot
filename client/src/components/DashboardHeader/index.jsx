import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const DashboardHeader = ({
  repoCount,
  projectsCount,
  starsCount,
  followersCount,
  followingCount,
  baseUrl
}) => (
  <nav className={styles.navbar}>
    <ul className={styles.navbar_list}>
      <li>
        <NavLink to={baseUrl} className={styles.link} activeClassName="selected">
          Overview
        </NavLink>
      </li>
      <li>
        <NavLink className={styles.link} to={`${baseUrl}?tab=repositories`} activeClassName="selected">
          Repositories{repoCount && <span>{repoCount}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=projects`} className={styles.link} activeClassName="selected">
          Projects{projectsCount && <span>{projectsCount}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=stars`} className={styles.link} activeClassName="selected">
          Stars{starsCount && <span>{starsCount}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=followers`} className={styles.link} activeClassName="selected">
          Followers{followersCount && <span>{followersCount}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=following`} className={styles.link} activeClassName="selected">
          Following{followingCount && <span>{followingCount}</span>}
        </NavLink>
      </li>
    </ul>
  </nav>
);

DashboardHeader.propTypes = {
  repoCount: PropTypes.array,
  projectsCount: PropTypes.number,
  starsCount: PropTypes.number,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
  baseUrl: PropTypes.string
};

export default DashboardHeader;
