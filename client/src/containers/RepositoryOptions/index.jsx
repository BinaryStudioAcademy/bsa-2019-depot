import React from 'react';
import { Grid, Header, Divider, Button, Message, Loader, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { InputError } from '../../components/InputError';
import { fetchRepoSettings } from '../../routines/routines';
import { renameRepo, deleteRepo } from './actions';
import styles from './styles.module.scss';
import { getRepositoryByOwnerAndName, changeRepoType } from '../../services/repositoryService';
import * as elasticHelper from '../../helpers/elasticsearchHelper';
import { getOwnerUserPermissions } from '../../helpers/checkPermissionsHelper';

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

class RepositoryOptions extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.match;
    const { username, reponame } = params;

    this.oldName = reponame;
    this.state = {
      name: reponame,
      owner: username,
      repoInfo: null,
      isAccessGranted: null
    };
  }

  validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^.*[\w]+.*$/, 'Invalid repository name')
      .required('Required')
  });

  async componentDidMount() {
    const { owner, name } = this.state;
    const { fetchRepoSettings, match, userId } = this.props;
    const { username, reponame } = match.params;
    const isAccessGranted = await getOwnerUserPermissions(username, reponame, userId);
    this.setState({
      isAccessGranted
    });
    fetchRepoSettings({
      owner,
      name
    });
  }

  async componentWillMount() {
    const { owner, name } = this.state;
    await this.getRepoInfo(owner, name);
  }

  async getRepoInfo(owner, reponame) {
    const data = await getRepositoryByOwnerAndName({ username: owner, reponame });
    this.setState({ repoInfo: data });
  }

  onClickDelete = () => {
    const {
      owner,
      repoInfo: { id, isPublic }
    } = this.state;
    const { deleteRepo, history } = this.props;
    const { oldName } = this;

    deleteRepo({
      owner,
      name: oldName
    });
    if (isPublic) {
      elasticHelper.deleteRepo(id);
    }
    history.push(`/${owner}`);
  };

  onClickRename = ({ name }) => {
    const {
      owner,
      repoInfo: { id, isPublic }
    } = this.state;
    const { oldName } = this;
    const { renameRepo, history } = this.props;
    const transformedName = name.trim().replace(/\s+/g, '-');

    renameRepo({
      owner,
      oldName,
      name: transformedName
    });
    if (isPublic) {
      elasticHelper.updateRepo(id, transformedName, owner);
    }
    history.push(`/${owner}/${transformedName}/settings`);
  };

  onClickUpdateRepoType = async () => {
    const {
      owner,
      name,
      repoInfo,
      repoInfo: { id, userId }
    } = this.state;
    const { history } = this.props;
    repoInfo.isPublic = !repoInfo.isPublic;
    await changeRepoType({
      owner,
      reponame: name,
      request: { isPublic: repoInfo.isPublic, repositoryId: id, userId }
    });
    if (repoInfo.isPublic) {
      elasticHelper.addRepo(id, name, owner);
    } else {
      elasticHelper.deleteRepo(id);
    }
    history.push(`/${owner}/${name}/settings`);
    window.location.reload();
  };

  render() {
    const { repoInfo, isAccessGranted } = this.state;
    const { loading } = this.props.repoSettingsData;
    const { match, currentUserName } = this.props;
    const { username } = match.params;
    if (!repoInfo || loading) {
      return <Loader />;
    }
    const {
      name,
      repoInfo: { isPublic }
    } = this.state;
    return (
      <Grid container stackable className={styles.box}>
        <Grid.Column className={styles.second_column}>
          <Header as="h2">Settings</Header>
          <Divider />
          {repoInfo && <Header as="h4">Repository name</Header>}
          <Formik initialValues={{ name }} onSubmit={this.onClickRename} validationSchema={this.validationSchema}>
            {({ values: { name }, errors, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field name="name" value={name} className={styles.text_input} onChange={handleChange} />
                <Button className={styles.button_rename} disabled={!!errors.name} type="submit">
                  Rename
                </Button>
                <InputError name="name" />
              </Form>
            )}
          </Formik>
          <Header as="h2">Danger Zone</Header>
          <div className={styles.dangerZone}>
            {(currentUserName === username || isAccessGranted) &&
              renderDangerField(
                isPublic ? 'Make this repository private' : 'Make this repository public',
                isPublic ? 'Hide this repository from the public.' : 'Make this repository visible to anyone.',
                isPublic ? 'Make private' : 'Make public',
                this.onClickUpdateRepoType
              )}
            {(currentUserName === username || isAccessGranted) &&
              renderDangerField(
                'Delete this repository',
                'Once you delete a repository, there is no going back. Please be certain.',
                'Delete this repository',
                this.onClickDelete
              )}
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

RepositoryOptions.propTypes = {
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
  deleteRepo: PropTypes.func.isRequired,
  currentUserName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = ({ repoSettingsData, profile: { currentUser } }) => ({
  repoSettingsData,
  currentUserName: currentUser.username,
  userId: currentUser.id
});

const mapDispatchToProps = {
  fetchRepoSettings,
  renameRepo,
  deleteRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryOptions);
