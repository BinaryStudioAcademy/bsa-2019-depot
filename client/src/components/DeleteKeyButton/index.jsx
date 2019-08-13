import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const DeleteKeyButton = ({ keyId, onClick }) => {
  function handleClick() {
    onClick(keyId);
  }

  return (
    <Button basic color="red" compact onClick={handleClick}>
      Delete
    </Button>
  );
};

DeleteKeyButton.propTypes = {
  keyId: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default DeleteKeyButton;
