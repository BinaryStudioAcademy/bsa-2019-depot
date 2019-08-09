import React from 'react';
import { Grid, Menu, Header, Divider, Input, Button, Message } from 'semantic-ui-react';
import styles from './styles.module.scss';
import { connect } from 'react-redux';
import { fetchRepoSettings } from '../../routines/routines';
import { postRepoSettings } from '../../routines/routines';
import { changePrivacy, renameRepo } from './actions';
import PropTypes from 'prop-types';

const renderDangerField = (header, description, buttonName, clickHandler) => (
    <Message className={styles.dangerField}>
        <Grid>
            <Grid.Column width={12}>
                <Header as="h6">{header}</Header>
                <p>{description}</p>
            </Grid.Column>
            <Grid.Column width={4}>
                <Button type="button" className={styles.dangerButton} fluid onClick={clickHandler}>
                    {buttonName}
                </Button>
            </Grid.Column>
        </Grid>
    </Message>
);

class RepoSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.location.pathname.split('/')[2],
            owner: this.props.location.pathname.split('/')[1],
            isPublic: this.props.repoSettingsData.settings.isPublic
        };
    }

  makePrivateHandleClick = () => {
      this.props.changePrivacy({
          ...this.state,
          isPublic: false
      });
  };

  makePublicHandleClick = () => {
      this.props.changePrivacy({
          ...this.state,
          isPublic: true
      });
  };

  transferHandleClick = () => {
      this.props.fetchRepoSettings({
          owner: this.state.owner,
          name: this.state.name
      });
  };

  deleteHandleClick = () => {};

  handleChangeRepoName = event => {
      this.setState({
          name: event.target.value
      });
  };

  onClickRename = () => {
      this.props.renameRepo({
          owner: this.state.owner,
          oldName: this.props.repoSettingsData.settings.name,
          name: this.state.name
      });
  };

  componentDidMount() {
      this.props.fetchRepoSettings({
          owner: this.state.owner,
          name: this.state.name
      });
  }
  render() {
      const { settings } = this.props.repoSettingsData;
      return (
          <Grid container>
              <Grid.Column width={4}>
                  <Menu vertical>
                      <Menu.Item>Options</Menu.Item>
                  </Menu>
              </Grid.Column>
              <Grid.Column width={12}>
                  <Header as="h2">Settings</Header>
                  <Divider />

                  <Header as="h4">Repository name</Header>
                  <Input className={styles.text_input} defaultValue={this.state.name} onChange={this.handleChangeRepoName} />
                  <Button className={styles.button_rename} type="button" onClick={this.onClickRename}>
            Rename
                  </Button>

                  <Header as="h2">Danger Zone</Header>
                  <div className={styles.dangerZone}>
                      {settings.isPublic
                          ? renderDangerField(
                              'Make this repository private',
                              'Hide this repository from the public. ',
                              'Make private',
                              this.makePrivateHandleClick
                          )
                          : renderDangerField(
                              'Make this repository public',
                              'Make this repository visible to anyone.',
                              'Make public',
                              this.makePublicHandleClick
                          )}
                      {renderDangerField(
                          'Transfer ownership',
                          'Transfer this repository to another user or to an organization where you have the ability to create repositories.',
                          'Transfer',
                          this.transferHandleClick
                      )}
                      {renderDangerField(
                          'Delete this repository',
                          'Once you delete a repository, there is no going back. Please be certain.',
                          'Delete this repository',
                          this.deleteHandleClick
                      )}
                  </div>
              </Grid.Column>
          </Grid>
      );
  }
}

RepoSettings.propTypes = {
    repoSettingsData: PropTypes.exact({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        settings: PropTypes.exact({
            name: PropTypes.string,
            owner: PropTypes.string,
            isPublic: PropTypes.bool
        })
    }).isRequired,
    location: PropTypes.exact({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string
    }),
    fetchRepoSettings: PropTypes.func.isRequired,
    postRepoSettings: PropTypes.func.isRequired,
    changePrivacy: PropTypes.func.isRequired,
    renameRepo: PropTypes.func.isRequired
};

const mapStateToProps = ({ repoSettingsData }) => ({
    repoSettingsData
});

const mapDispatchToProps = {
    fetchRepoSettings,
    postRepoSettings,
    changePrivacy,
    renameRepo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RepoSettings);
