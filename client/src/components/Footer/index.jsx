import React from 'react';
import { Container, Grid, Responsive } from 'semantic-ui-react';
import { ReactComponent as LogoSVG } from '../../styles/assets/icons/logo_icon_dark.svg';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Footer = ({ isAuthorized, username }) =>
  isAuthorized && username ? (
    <Container>
      <Grid centered>
        <Grid.Row>
          <Grid.Column computer={16} mobile={16}>
            <Grid.Row className={styles.footer}>
              <Grid.Column mobile={7}>
                <ul className={styles.menuLeft}>
                  <li className={styles.copy}>&copy; 2019 Depot</li>
                </ul>
              </Grid.Column>
              <Grid.Column computer={2} className={styles.logo}>
                <Responsive minWidth={992}>
                  <a href="/">
                    <LogoSVG width={32} height={32} />
                  </a>
                </Responsive>
              </Grid.Column>
              <Grid.Column mobile={7}>
                <ul className={styles.menuRight}>
                  <li>
                    <a href="/mobile">Mobile App</a>
                  </li>
                </ul>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  ) : null;

Footer.propTypes = {
  isAuthorized: PropTypes.bool,
  username: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    isAuthorized,
    currentUser: { username }
  }
}) => ({
  username,
  isAuthorized
});

export default connect(mapStateToProps)(Footer);
