/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';

import { setStatus, getStatus } from '../../services/userService';

import styles from './styles.module.scss';

const StatusModal = ({ showStatusModal, hideModal, username }) => {
  const defaultStatus = 'defaultValue';
  const [status, setStatusText] = useState('');
  const [prevStatus, setPrevStatusText] = useState(defaultStatus);
  if (prevStatus === defaultStatus && username) {
    getStatus(username).then(({ status }) => setPrevStatusText(status));
  }

  const onSetStatus = () => {
    setStatus(status);
    hideModal();
  };

  const changeStatus = ({ target }) => {
    setStatusText(target.value);
    setPrevStatusText('');
  };

  const onClearStatus = () => {
    setStatus('');
    hideModal();
  };

  return (
    <Modal open={showStatusModal} onClose={hideModal} size="tiny">
      <Modal.Header>Edit status</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field
            control="input"
            placeholder={"What's happening?"}
            value={status === '' && prevStatus !== '' ? prevStatus : status}
            onChange={changeStatus}
          />
          <div className={styles.statusFormButtons}>
            <Button type="submit" color="blue" fluid onClick={onSetStatus}>
              Set status
            </Button>
            <Button basic fluid onClick={onClearStatus}>
              Clear status
            </Button>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

StatusModal.propTypes = {
  showStatusModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  username: PropTypes.string
};

export default StatusModal;
