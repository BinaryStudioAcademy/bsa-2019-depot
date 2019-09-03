import React from 'react';
import PropTypes from 'prop-types';

import Octicon, { Star } from '@primer/octicons-react';
import { Button } from 'semantic-ui-react';
import styles from './styles.module.scss';

const StarButton = props => {
  const { starClickHandler, isStar } = props;
  return (
    <Button compact className={styles.repo_item_stars} onClick={starClickHandler}>
      <Octicon className={styles.star_icon} icon={Star} />
      {isStar ? 'Unstar' : 'Star'}
    </Button>
  );
};

StarButton.propTypes = {
  starClickHandler: PropTypes.func.isRequired,
  isStar: PropTypes.bool.isRequired
};

export default StarButton;
