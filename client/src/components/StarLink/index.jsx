import React from 'react';
import { Link } from 'react-router-dom';
import Octicon, { Star } from '@primer/octicons-react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const StarLink = ({ href, starsCount }) => (
  <Link to={href} className={styles.starLink}>
    <Octicon icon={Star} />
    {starsCount}
  </Link>
);

StarLink.propTypes = {
  starsCount: PropTypes.number.isRequired,
  href: PropTypes.string.isRequired
};

export default StarLink;
