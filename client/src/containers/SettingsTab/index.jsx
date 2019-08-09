import React from 'react';
import { Grid, Menu, Header, Divider, Input, Button, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchRepoSettings } from '../../routines/routines';
import { changePrivacy, renameRepo, deleteRepo } from './actions';
import styles from './styles.module.scss';

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

        const params = this.props.location.pathname.split('/');
        const { isPublic } = this.props.repoSettingsData.settings;

        this.state = {
            owner: params[2],
            name: params[3],
            isPublic
        };
    }

    componentDidMount() {
        const { owner, name } = this.state;
        this.props.fetchRepoSettings({
            owner,
            name
        });
    }

  changePrivacyHandleClick = () => {
      this.props.changePrivacy({
          ...this.state
      });
  };

  deleteHandleClick = () => {
      this.props.deleteRepo({
          ...this.state
      });
  };

  handleChangeRepoName = event => {
      this.setState({
          name: event.target.value
      });
  };

  onClickRename = () => {
      const { owner, name } = this.state;
      this.props.renameRepo({
          owner,
          oldName: this.props.repoSettingsData.settings.name,
          name
      });
  };

  render() {
      const { settings } = this.props.repoSettingsData;
      return (
          <Grid container stackable>
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
                              this.changePrivacyHandleClick
                          )
                          : renderDangerField(
                              'Make this repository public',
                              'Make this repository visible to anyone.',
                              'Make public',
                              this.changePrivacyHandleClick
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
            isPublic: PropTypes.bool,
            id: PropTypes.string
        })
    }).isRequired,
    location: PropTypes.exact({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string
    }),
    fetchRepoSettings: PropTypes.func.isRequired,
    changePrivacy: PropTypes.func.isRequired,
    renameRepo: PropTypes.func.isRequired,
    deleteRepo: PropTypes.func.isRequired
};

const mapStateToProps = ({ repoSettingsData }) => ({
    repoSettingsData
});

const mapDispatchToProps = {
    fetchRepoSettings,
    changePrivacy,
    renameRepo,
    deleteRepo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RepoSettings);
