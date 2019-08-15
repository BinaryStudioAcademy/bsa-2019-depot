import React from 'react';
import { Container, Grid, Responsive } from 'semantic-ui-react';
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
                    <svg height={24} viewBox="0 0 16 16" version="1.1" width={24} aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                      />
                    </svg>
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
}

const mapStateToProps = rootState => {
  return {
    isAuthorized: rootState.profile.isAuthorized
  };
};
export default connect(mapStateToProps)(Footer);
