import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export class InputError extends React.Component {
  render() {
    return <div className={styles.userinfo_wrapper}>{this.props.children}</div>;
  }
}

InputError.propTypes = {
  children: PropTypes.string
};
