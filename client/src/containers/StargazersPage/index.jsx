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
        <Header as='h2'>Stargazers</Header>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column className={styles.stargazerBox}>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' className={styles.stargazerImage} />
              <Link className={styles.profileLink} to="">PashaNaumencko</Link>
              <Octicon className={styles.icon} icon={getIconByName('clock')} />
              <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' className={styles.stargazerImage} />
              <Link className={styles.profileLink} to="">PashaNaumencko</Link>
              <Octicon className={styles.icon} icon={getIconByName('clock')} />
              <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' className={styles.stargazerImage} />
              <Link className={styles.profileLink} to="">PashaNaumencko</Link>
              <Octicon className={styles.icon} icon={getIconByName('clock')} />
              <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column className={styles.stargazerBox}>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' className={styles.stargazerImage} />
              <Link className={styles.profileLink} to="">PashaNaumencko</Link>
              <Octicon className={styles.icon} icon={getIconByName('clock')} />
              <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' className={styles.stargazerImage} />
              <Link className={styles.profileLink} to="">PashaNaumencko</Link>
              <Octicon className={styles.icon} icon={getIconByName('clock')} />
              <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default StargazersPage;