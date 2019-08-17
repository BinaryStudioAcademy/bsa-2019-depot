import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ReactComponent as RoboSVG } from '../../styles/assets/404/NotFound.svg';
import styles from './styles.module.scss';

const NotFound = () => (
  <Container>
    <RoboSVG className={styles.robot} />
    <h1>Oops, you broke the internet</h1>
    <p>
      Just kidding. But it seems our search robot can't find the page you're looking for. Please make sure you've
      entered the correct address, or return to <Link to="/">home</Link>.
    </p>
  </Container>
);

export default NotFound;
