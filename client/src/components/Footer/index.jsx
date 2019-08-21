import React from 'react';
import { Container, Grid, Responsive } from 'semantic-ui-react';
import { ReactComponent as LogoSVG } from '../../styles/assets/icons/logo_icon.svg';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Footer = ({ isAuthorized }) =>
  isAuthorized ? (
    <Container className="teststtsat">
      <Grid centered>
        <Grid.Row>
          <Grid.Column computer={12} mobile={16}>
            <Grid.Row className={styles.footer}>
              <Grid.Column mobile={7}>
                <ul className={styles.menuLeft}>
                  <li className={styles.copy}>&copy; 2019 Depot</li>
                  <li>
                    <a href="/">API</a>
                  </li>
                  <li>
                    <a href="/">About</a>
                  </li>
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
                    <a href="/">Mobile App</a>
                  </li>
                  <li>
                    <a href="/">Status</a>
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
  isAuthorized: PropTypes.bool
};

const mapStateToProps = rootState => {
  return {
    isAuthorized: rootState.profile.isAuthorized
  };
};
export default connect(mapStateToProps)(Footer);
