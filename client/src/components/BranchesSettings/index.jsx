import React, { useState } from 'react';
import { Header, Divider, Form, Dropdown, Modal, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as repositoryService from '../../services/repositoryService';
import { fetchCurrentRepo } from '../../routines/routines';

import styles from './styles.module.scss';

const BranchesSettings = props => {
  const { branches, defaultBranchId } = props;
  const defaultBranch = defaultBranchId ? branches.find(branch => defaultBranchId === branch.id) : branches[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [currentBranch, setBranch] = useState(defaultBranch.id);

  function handleChange(e, { value }) {
    setBranch(value);
  }

  function handleOpen() {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  async function onSubmit() {
    const {
      fetchCurrentRepo,
      match: {
        params: { username, reponame }
      }
    } = props;

    await repositoryService.updateRepositoryByOwnerAndName({
      owner: username,
      reponame,
      request: { defaultBranchId: currentBranch }
    });

    fetchCurrentRepo({ username, reponame });
    handleClose();
  }

  const getCurrentBranchName = () => branches.find(({ id }) => id === currentBranch).name;

  const renderModal = () => {
    return (
      <Modal
        open={modalOpen}
        onClose={handleClose}
        trigger={<Button onClick={handleOpen} content="Update" />}
        size="tiny"
      >
        <Modal.Header>Update default branch</Modal.Header>
        <Modal.Content>
          Changing your default branch can have unintended consequences that can affect new pull requests and clones.
        </Modal.Content>
        <Modal.Actions>
          <span>
            <Button fluid onClick={onSubmit} className={styles.dangerButton}>
              I understand, update the default branch.
            </Button>
          </span>
        </Modal.Actions>
      </Modal>
    );
  };

  return (
    <>
      <Header as="h2">Default branch</Header>
      <Divider />
      <p>
        The default branch is considered the “base” branch in your repository, against which all pull requests and code
        commits are automatically made, unless you specify a different branch.
      </p>
      <Form>
        <Form.Group>
          <Dropdown button text={getCurrentBranchName()}>
            <Dropdown.Menu>
              <Dropdown.Header content="Switch default branch" />
              <Dropdown.Divider />
              {branches.map(({ name, id }) => (
                <Dropdown.Item key={id} value={id} text={name} onClick={handleChange} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {renderModal()}
        </Form.Group>
      </Form>
    </>
  );
};

BranchesSettings.propTypes = {
  branches: PropTypes.array,
  defaultBranchId: PropTypes.string,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { branches, defaultBranchId }
    }
  }
}) => ({
  branches,
  defaultBranchId
});

const mapDispatchToProps = {
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BranchesSettings);
