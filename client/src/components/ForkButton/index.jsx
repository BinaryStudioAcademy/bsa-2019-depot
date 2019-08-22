import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Icon, Modal, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { forkRepo } from '../../routines/routines';
import { actions } from './actions';

class ForkButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => {
    this.props.clearModal();
    this.setState({ modalOpen: false });
  };

  handleRedirect = (username, repoName) => {
    this.handleClose();
    window.location.replace(`/${username}/${repoName}`);
  };

  handleFork = () => {
    const { owner, repoName: repo } = this.props;
    const payload = { owner, repo };
    this.props.forkRepo(payload);
  };

  render() {
    const { forkRepoData: { loading, username }, repoName, forkedCount } = this.props;
    return (
      <Modal
        closeIcon
        dimmer='inverted'
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
        trigger={
          <Button size="small" as="div" compact labelPosition="right" onClick={this.handleOpen}>
            <Button size="small" compact>
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
  forkCount: PropTypes.number,
  currentUser: PropTypes.object,
  forkRepo: PropTypes.func,
  clearModal: PropTypes.func,
  loading: PropTypes.bool,
  username: PropTypes.string
};

ForkButton.defaultProps = {
  owner: '',
  repoName: '',
  loading: false,
  username: null,
  forkedCount: 0
};

const mapStateToProps = ({ forkRepo }) => ({
  forkRepoData: forkRepo
});

const mapDispatchToProps = {
  forkRepo,
  ...actions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForkButton);
