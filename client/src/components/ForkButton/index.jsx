import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as repositoryService from '../../services/repositoryService';
import { Button, Label, Icon, Modal, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
// import { forkRepo } from '../../routines/routines';
// import { actions } from './actions';

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

  // handleClose = () => {
  //   this.props.clearModal();
  //   this.setState({ modalOpen: false });
  // };

  handleRedirect = (username, repoName) => {
    // this.handleClose();
    this.setState({ modalOpen: false });
    window.location.replace(`/${username}/${repoName}`);
  };

  handleFork = () => {
    const { owner, currentRepoInfo } = this.props;
    const payload = { owner, repoData: currentRepoInfo };
    this.setState({ loading: true });
    repositoryService.forkRepo(payload)
      .then(data => this.setState({ username: data.username, loading: false }));
    // this.props.forkRepo(payload);
  };

  render() {
    const { repoName, currentRepoInfo: { forkedCount } } = this.props;
    const { username, loading } = this.state;
    return (
      <Modal
        closeIcon
        dimmer='inverted'
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
        trigger={
          <Button size="small" as="div" compact labelPosition="right" onClick={this.handleOpen}>
            <Button size="small" compact className={styles.forkButton}>
              <Icon name="fork" />
              Fork
            </Button>
            <Label as="a" basic pointing="left">
              {forkedCount}
            </Label>
          </Button>
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
        ) : username ? this.handleRedirect(username, repoName) : (
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
  // currentUser: PropTypes.object,
  // forkRepo: PropTypes.func,
  // clearModal: PropTypes.func,
  loading: PropTypes.bool,
  username: PropTypes.string,
  currentRepoInfo: PropTypes.object.isRequired
  // forkRepoData: PropTypes.object
};

ForkButton.defaultProps = {
  owner: '',
  repoName: '',
  loading: false,
  username: '',
  forkedCount: 0
};

const mapStateToProps = ({ currentRepo: { currentRepoInfo } }) => ({
  currentRepoInfo
});

// const mapDispatchToProps = {
//   forkRepo,
//   ...actions
// };

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(ForkButton);

