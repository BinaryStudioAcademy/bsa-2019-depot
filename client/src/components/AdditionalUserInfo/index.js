import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import styles from './styles.module.scss';
import UserPreview from '../UserPreview/index';

const AdditionalUserInfo = ({ company, location, bio, link, email, organizations }) => (
  <div className={styles.additionInfo}>
    {bio && <div>{bio}</div>}
    <ul>
      {company && (
        <li className={styles.additionInfoItem}>
          <span>
            <Icon name="users" />
            {company}
          </span>
        </li>
      )}
      {location && (
        <li className={styles.additionInfoItem}>
          <Icon name="location arrow" />
          <span>{location}</span>
        </li>
      )}
      {email && (
        <li className={styles.additionInfoItem}>
          <span>
            <Icon name="mail" />
            {email}
          </span>
        </li>
      )}
      {link && (
        <li className={styles.additionInfoItem}>
          <Icon name="linkify" />
          <a href={link}>{link}</a>
        </li>
      )}
      {organizations && (
        <li>
          <h3 className={styles.organizationsHeader}>Organizations</h3>
          <ul className={styles.organizationsList}>
            {organizations.map(organization => {
              const {
                user,
                user: { username }
              } = organization;
              return (
                <li key={username}>
                  <UserPreview size="small" orgUser={user} />
                </li>
              );
            })}
          </ul>
        </li>
      )}
    </ul>
  </div>
);

AdditionalUserInfo.propTypes = {
  bio: PropTypes.string,
  company: PropTypes.string,
  link: PropTypes.string,
  location: PropTypes.string,
  email: PropTypes.string,
  organizations: PropTypes.array
};

export default AdditionalUserInfo;
