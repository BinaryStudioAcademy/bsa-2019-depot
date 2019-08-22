import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import styles from './styles.module.scss';

const AdditionalUserInfo = ({ company, location, bio, link, email }) => (
  <div className={styles.additionInfo}>
    {bio && <div>{bio}</div>}
    <ul>
      {company && (
        <li>
          <span>
            <Icon name="users" />
            {company}
          </span>
        </li>
      )}
      {location && (
        <li>
          <Icon name="location arrow" />
          <span>{location}</span>
        </li>
      )}
      {email && (
        <li>
          <span>
            <Icon name="mail" />
            {email}
          </span>
        </li>
      )}
      {link && (
        <li>
          <Icon name="linkify" />
          <a href={link}>{link}</a>
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
  email: PropTypes.string
};

export default AdditionalUserInfo;
