import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ForkButton extends Component {
  state = { modalOpen: false };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  render() {
      const { forkCount, repoName } = this.props;
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
              <Modal.Actions>
                  <Button onClick={this.handleClose}>Cancel</Button>
                  <Button primary onClick={this.handleClose}>
            Fork
                  </Button>
              </Modal.Actions>
          </Modal>
      );
  }
}

ForkButton.propTypes = {
    owner: PropTypes.string,
    repoName: PropTypes.string,
    forkCount: PropTypes.number,
    currentUser: PropTypes.object
};

ForkButton.defaultProps = {
    owner: '',
    repoName: '',
    forkCount: 0
};

const mapStateToProps = state => state.profile;

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForkButton);
