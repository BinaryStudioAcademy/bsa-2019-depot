import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';

const CopyableInput = ({ url }) => {
  function copyText() {
    navigator.clipboard.writeText(url);
  }

  return (
    <Input
      type="text"
      fluid
      action={
        <Button className={styles.actionButton} onClick={copyText}>
          <Octicon verticalAlign="middle" icon={getIconByName('clippy')} />
        </Button>
      }
      size="small"
      className={styles.repoLinkInput}
      defaultValue={url}
    />
  );
};

CopyableInput.propTypes = {
  url: PropTypes.string.isRequired
};

export default CopyableInput;
