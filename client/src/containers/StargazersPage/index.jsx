import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import Octicon, { getIconByName } from '@primer/octicons-react';
import { Segment, Header, Image, Loader } from 'semantic-ui-react';
import styles from './styles.module.scss';

const StargazersPage = ({ stars, loading }) => {
  return loading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <Segment basic>
      <Header as="h2" className={styles.stargazerHeader}>
        Stargazers
      </Header>
      <div className={styles.stargazersGrid}>
        {stars.map(({ user: { username, imgUrl, location, createdAt } }, index) => (
          <div key={index} className={styles.stargazerBox}>
            <Image src={imgUrl} width="75" height="75" className={styles.stargazerImage} />
            <div className={styles.stargazerInfo}>
              <Link className={styles.profileLink} to={`/${username}`}>
                {username}
              </Link>
              {location ? (
                <>
                  <Octicon className={styles.icon} icon={getIconByName('location')} />
                  <span className={styles.stargazerDate}>{location}</span>
                </>
              ) : (
                <>
                  <Octicon className={styles.icon} icon={getIconByName('clock')} />
                  <span className={styles.stargazerDate}>Joined on {moment(createdAt).format('MMM DD, YYYY')}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Segment>
  );
};

StargazersPage.propTypes = {
  repoId: PropTypes.string.isRequired,
  stars: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { stars }
    },
    loading
  }
}) => ({
  stars,
  loading
});

export default connect(mapStateToProps)(StargazersPage);
