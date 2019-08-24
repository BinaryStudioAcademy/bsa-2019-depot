import React from 'react';
import { getUserImgLink } from '../../helpers/imageHelper';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const UserPreview = ({ size, orgUser }) => (
  <a href={`/${orgUser.username}`} className={styles.orgUserItem}>
    <img alt="organization logo" src={getUserImgLink(orgUser.imgUrl)} className={`orgUserPreview-${size || ''}`} />
  </a>
);

UserPreview.propTypes = {
  size: PropTypes.string,
  orgUser: PropTypes.object
};

export default UserPreview;
