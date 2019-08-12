import React from 'react';
import { Grid, Menu, Header, Divider, Input, Button, Message, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchRepoSettings } from '../../routines/routines';
import { renameRepo, deleteRepo } from './actions';
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

    const {
      match: {
        params: { owner, repository }
      }
    } = this.props;
    this.oldName = repository;

    this.state = {
      name: repository,
      owner
    };
  }

  componentDidMount() {
    const { owner, name } = this.state;
    this.props.fetchRepoSettings({
      owner,
      name
    });
  }

  onClickDelete = () => {
    const { owner, name } = this.state;
    this.props.deleteRepo({
      owner,
      name
    });
  };

  handleChangeRepoName = event => {
    this.setState({
      name: event.target.value
    });
  };

  onClickRename = () => {
    const { name, owner } = this.state;
    const { oldName } = this;

    this.props.renameRepo({
      owner,
      oldName,
      name
    });
    this.props.history.push(`/${owner}/${name}/settings`);
    window.location.reload();
  };

  render() {
    const { loading } = this.props.repoSettingsData;
    return !loading ? (
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
            {renderDangerField(
              'Delete this repository',
              'Once you delete a repository, there is no going back. Please be certain.',
              'Delete this repository',
              this.onClickDelete
            )}
          </div>
        </Grid.Column>
      </Grid>
    ) : (
      <Loader />
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
      id: PropTypes.string,
      isPublic: PropTypes.bool
    })
  }).isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.object,
  fetchRepoSettings: PropTypes.func.isRequired,
  renameRepo: PropTypes.func.isRequired,
  deleteRepo: PropTypes.func.isRequired
};

const mapStateToProps = ({ repoSettingsData }) => ({
  repoSettingsData
});

const mapDispatchToProps = {
  fetchRepoSettings,
  renameRepo,
  deleteRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoSettings);
