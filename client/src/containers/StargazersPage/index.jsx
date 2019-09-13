import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import Octicon, { getIconByName } from '@primer/octicons-react';
import { Segment, Header, Image, Loader, Container, Divider } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import { getStargazersList } from '../../services/repositoryService';

import styles from './styles.module.scss';

class StargazersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: {},
      loading: true
    };
  }

  componentDidMount() {
    this.getStargazersList();
  }

  getStargazersList() {
    const { repositoryId } = this.props;
    getStargazersList(repositoryId).then(stars => {
      this.setState({ stars, loading: false });
    });
  }

  render() {
    const { loading, stars } = this.state;

    return loading ? (
      <div>
        <Loader />
      </div>
    ) : (
      <Segment basic>
        {stars.length ? (
          <>
            <Header as="h2" className={styles.stargazerHeader}>
              Stargazers
            </Header>
            <div className={styles.stargazersGrid}>
              {stars.map(({ user: { username, imgUrl, location, createdAt } }, id) => (
                <div key={id} className={styles.stargazerBox}>
                  <Image src={getUserImgLink(imgUrl)} width="75" height="75" className={styles.stargazerImage} />
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
                        <span className={styles.stargazerDate}>
                          Joined on {moment(createdAt).format('MMM DD, YYYY')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Container textAlign="center">
            <Octicon className={styles.icon} icon={getIconByName('star')} />
            <Divider hidden />
            <Header as="h2">Be the first to star this repository.</Header>
            <Segment basic>
              <a href="https://help.github.com/articles/about-stars">Learn more </a>about how starring works on Depot.
            </Segment>
          </Container>
        )}
      </Segment>
    );
  }
}

StargazersPage.propTypes = {
  repositoryId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id }
    }
  }
}) => ({ repositoryId: id });

export default connect(mapStateToProps)(StargazersPage);
