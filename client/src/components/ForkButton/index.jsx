import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as repositoryService from '../../services/repositoryService';
import { Button, Label, Modal, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';

class ForkButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      loading: false,
      username: ''
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleRedirect = (username, repoName) => {
    this.setState({ modalOpen: false });
    window.location.replace(`/${username}/${repoName}`);
  };

  handleFork = () => {
    const { owner, currentRepoInfo } = this.props;
    const payload = { owner, repoData: currentRepoInfo };
    this.setState({ loading: true });
    repositoryService.forkRepo(payload).then(data => this.setState({ username: data.username, loading: false }));
  };

  render() {
    const {
      repoName,
      currentRepoInfo: { forkedCount },
      isOwnRepo,
      owner
    } = this.props;
    const { username, loading } = this.state;
    return (
      <Modal
        closeIcon
        dimmer="inverted"
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
        trigger={
          isOwnRepo ? (
            <Button size="small" as="div" compact labelPosition="right">
              <Button disabled compact className={styles.forkButton} onClick={this.handleOpen}>
                <Octicon className={styles.forkButtonIcon} icon={getIconByName('repo-forked')} />
                Fork
              </Button>
              <Label basic>
                <Link to={`/${owner}/${repoName}/insights`}>{forkedCount}</Link>
              </Label>
            </Button>
          ) : (
            <Button size="small" as="div" compact labelPosition="right">
              <Button compact className={styles.forkButton} onClick={this.handleOpen}>
                <Octicon className={styles.forkButtonIcon} icon={getIconByName('repo-forked')} />
                Fork
              </Button>
              <Label basic>
                <Link to={`/${owner}/${repoName}/insights`}>{forkedCount}</Link>
              </Label>
            </Button>
          )
        }
      >
        {loading ? (
          <>
            <Modal.Header>You are going to fork {repoName}</Modal.Header>
            <Modal.Content>
              {' '}
              <Loader active inline="centered" />
            </Modal.Content>
          </>
        ) : username ? (
          this.handleRedirect(username, repoName)
        ) : (
          <>
            <Modal.Header>You are going to fork {repoName}</Modal.Header>
            <Modal.Actions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button primary onClick={this.handleFork}>
                Fork
              </Button>
            </Modal.Actions>
          </>
        )}
      </Modal>
    );
  }
}

ForkButton.propTypes = {
  owner: PropTypes.string,
  repoName: PropTypes.string,
  forkedCount: PropTypes.number,
  loading: PropTypes.bool,
  username: PropTypes.string,
  currentRepoInfo: PropTypes.object.isRequired,
  isOwnRepo: PropTypes.bool
};

ForkButton.defaultProps = {
  owner: '',
  repoName: '',
  loading: false,
  username: '',
  forkedCount: 0
};

const mapStateToProps = ({
  currentRepo: {
    repository: { currentRepoInfo }
  }
}) => ({
  currentRepoInfo
});

export default connect(mapStateToProps)(ForkButton);
