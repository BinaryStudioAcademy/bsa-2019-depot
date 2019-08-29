import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Octicon, { getIconByName } from '@primer/octicons-react';
import { Container, Header, Grid, Image } from 'semantic-ui-react';
import styles from './styles.module.scss';

class StargazersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stargazers: [],
      loading: false
    };
  }

  render() {
    return (
      <Container>
        <Header as='h2' className={styles.stargazerHeader}>Stargazers</Header>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default StargazersPage;