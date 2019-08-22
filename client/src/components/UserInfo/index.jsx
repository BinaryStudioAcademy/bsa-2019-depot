import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import Octicon, { Smiley } from '@primer/octicons-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const UserInfo = ({ imgUrl, name, username }) => (
  <div className={styles.userInfo}>
    <div className={styles.avatar_wrapper}>
      <Link to="">
        <img src={getUserImgLink(imgUrl)} alt="user_avatar" />
      </Link>
    </div>
    <div className={styles.userDetails}>
      <Link to="" className={styles.set_status}>
        <Octicon icon={Smiley} />
        Set status
      </Link>
      <div className={styles.namesContainer}>
        <h1>
          <span className={styles.fullname}>{name ? <span className={styles.name}>{name}</span> : null}</span>
          {username}
        </h1>
      </div>
      <Link to="/settings/profile" className={styles.edit_profile}>
        <Button fluid className={styles.editButton}>
          Edit profile
        </Button>
      </Link>
    </div>
  </div>
);

UserInfo.propTypes = {
  username: PropTypes.string,
  name: PropTypes.string,
  imgUrl: PropTypes.string
};

export default UserInfo;
