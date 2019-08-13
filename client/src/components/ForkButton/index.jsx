import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Icon, Modal, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { forkRepo } from '../../routines/routines';
import { actions } from './actions';

class ForkButton extends Component {
  state = { modalOpen: false };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => {
    this.props.clearModal();
    this.setState({ modalOpen: false });
  };

  handleFork = () => {
    const { owner, repoName: repo } = this.props;
    const payload = { owner, repo };
    this.props.forkRepo(payload);
  };

  render() {
    const { forkCount, repoName, error, loading, path } = this.props;
    return (
      <Modal
        closeIcon
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
              {forkCount}
            </Label>
          </Button>
        }
      >
        <Modal.Header>You are going to fork {repoName}</Modal.Header>
        {error ? <Modal.Content>{error}</Modal.Content> : null}
        {path ? <Modal.Content>Path to your forked repository: {path}</Modal.Content> : null}
        {loading ? (
          <Modal.Content>
            {' '}
            <Loader active inline="centered" />
          </Modal.Content>
        ) : null}

        <Modal.Actions>
          <Button onClick={this.handleClose}>{!error && !path ? 'Cancel' : 'Ok'}</Button>
          {!error && !path ? (
            <Button primary onClick={this.handleFork}>
              Fork
            </Button>
          ) : null}
        </Modal.Actions>
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
  error: PropTypes.bool,
  loading: PropTypes.bool,
  path: PropTypes.string
};

ForkButton.defaultProps = {
  owner: '',
  repoName: '',
  forkCount: 0
};

const mapStateToProps = state => ({ ...state.profile, ...state.forkRepo });

const mapDispatchToProps = { forkRepo, ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForkButton);
