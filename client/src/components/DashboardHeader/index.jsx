import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const DashboardHeader = ({
  repoCount,
  projects,
  starsCount,
  followers,
  following,
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
          Projects{projects && <span>{projects}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=stars`} className={styles.link} activeClassName="selected">
          Stars{starsCount && <span>{starsCount}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=followers`} className={styles.link} activeClassName="selected">
          Followers{followers && <span>{followers}</span>}
        </NavLink>
      </li>
      <li>
        <NavLink to={`${baseUrl}?tab=following`} className={styles.link} activeClassName="selected">
          Following{following && <span>{following}</span>}
        </NavLink>
      </li>
    </ul>
  </nav>
);

DashboardHeader.propTypes = {
  repoCount: PropTypes.array,
  projects: PropTypes.number,
  starsCount: PropTypes.number,
  followers: PropTypes.number,
  following: PropTypes.number,
  baseUrl: PropTypes.string
};

export default DashboardHeader;
