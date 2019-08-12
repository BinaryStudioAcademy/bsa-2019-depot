import React from 'react';
import PropTypes from 'prop-types';
import './styles.module.scss';
import { ReactComponent as GoogleLogoSVG } from '../../styles/assets/icons/google.svg';

const GoogleAuth = ({ text, link }) => {
  return (
    <a href={link}>
      <button type="button" className="google-button">
        <span className="google-button__icon">
          <GoogleLogoSVG />
        </span>
        <span className="google-button__text">{text}</span>
      </button>
    </a>
  );
};

GoogleAuth.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string
};

export default GoogleAuth;
