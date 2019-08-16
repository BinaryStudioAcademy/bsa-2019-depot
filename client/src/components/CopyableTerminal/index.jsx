import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import Octicon, { Clippy } from '@primer/octicons-react';
import styles from './styles.module.scss';

const CopyableTerminal = ({ str }) => {
  const copyToClipboard = str => navigator.clipboard.writeText(str);

  function onClick() {
    copyToClipboard(str);
  }

  return (
    <div className={styles.copyable}>
      <pre>{str}</pre>
      <Button className={styles.clipboardButton} icon={<Octicon icon={Clippy} />} onClick={onClick}></Button>
    </div>
  );
};

CopyableTerminal.propTypes = {
  str: PropTypes.string
};

CopyableTerminal.defaultProps = {
  str: ''
};

export default CopyableTerminal;
