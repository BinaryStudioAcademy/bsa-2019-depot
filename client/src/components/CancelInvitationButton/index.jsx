import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const CancelInvitationButton = ({ type, id, onClick }) => {
  function handleClick() {
    onClick(id);
  }
  return type === 'button' ? (
    <Button onClick={handleClick} basic size="tiny" color="red" content="Cancel invite" />
  ) : (
    <Icon name="close" onClick={handleClick} />
  );
};

CancelInvitationButton.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default CancelInvitationButton;
