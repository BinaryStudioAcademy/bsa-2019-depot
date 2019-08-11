import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Icon, Modal, Header, List, Image, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ForkButton extends Component {
    render(props) {
        return (
            <Modal
                trigger={
                    <Button size="small" as="div" compact labelPosition="right">
                        <Button size="small" compact>
                            <Icon name="fork" />
              Fork
                        </Button>
                        <Label as="a" basic pointing="left">
                            {this.props.forkCount}
                        </Label>
                    </Button>
                }
            >
                <Modal.Header>Fork {this.props.repoName}</Modal.Header>
                <Modal.Content>
                    <Header>Where should we fork {this.props.repoName}?</Header>
                    <List>
                        <List.Item>
                            <Image avatar src={null} />
                            <Header as="div">this.props.currentUser.username</Header>
                        </List.Item>
                    </List>
                    <Divider />
                </Modal.Content>
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
