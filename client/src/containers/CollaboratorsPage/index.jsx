import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Divider, Form, Search, Button, Checkbox } from 'semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';
import { getUsersForCollaboratorsAddition } from '../../services/userService';
import { invite } from '../../services/inviteCollaboratorService';

import styles from './styles.module.scss';

const permissionValidationSchema = Yup.object().shape({
  permission: Yup.string().required('Permission is required!')
});

const initialState = {
  isLoading: false,
  results: [],
  value: ''
};

class CollaboratorsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      collaborators: [],
      repository: null
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const repository = await getRepositoryByOwnerAndName({ username, reponame });
    this.setState({
      repository
    });
  }

  handleSearchChange = async (e, { value }) => {
    const {
      repository: { id: repositoryId }
    } = this.state;
    const { userId } = this.props;
    this.setState({ isLoading: true, value });
    if (!value) return this.setState(initialState);
    const users = await getUsersForCollaboratorsAddition(value, repositoryId, userId);
    const results = users.map(user => ({
      content: user
    }));
    this.setState({
      isLoading: false,
      results
    });
  };

  resultRenderer = ({ content }) => <p>{content}</p>;

  handleResultSelect = (e, { result }) => this.setState({ username: result.content });

  handleChangeRadio = handleChange => (e, data) => {
    const { name, value } = data;
    e.target.name = name;
    e.target.value = value;
    handleChange(e);
  };

  submitCollaboratorAddition = values => {
    const { permission } = values;
    const {
      history,
      match: {
        params: { username: senderUsername }
      }
    } = this.props;
    const {
      repository: { name: reponame, id: repositoryId },
      username
    } = this.state;
    invite({
      senderUsername,
      username,
      reponame,
      repositoryId,
      permission
    });
    history.push('/settings');
  };

  renderCollaboratorsPage = () => {
    const { collaborators, isLoading, value, results } = this.state;

    return (
      <Container>
        <div className={styles.collaborators_container}>
          <div className={styles.collaborators_header}>
            <span>
              <b>Collaborators</b>
            </span>
            <span>Push access to repository</span>
          </div>
          <Divider className={styles.divide} />

          <div className={styles.collaborators_list}>
            {collaborators.length ? (
              <ul></ul>
            ) : (
              <p>This repository doesn’t have any collaborators yet. Use the form below to add a collaborator.</p>
            )}
          </div>

          <Divider className={styles.divide} />
          <Form className={styles.collaborators_search_container}>
            <Form.Field>
              <span>
                <b>Search collaborator by name</b>
              </span>
              <Search
                size="mini"
                fluid
                placeholder="Username"
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={results}
                value={value}
                resultRenderer={this.resultRenderer}
              />
            </Form.Field>
          </Form>
        </div>
      </Container>
    );
  };

  renderChoosePermission = ({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => {
    const { permission } = values;
    const handleChangeRadio = this.handleChangeRadio(handleChange);

    return (
      <Form className={styles.formField} onSubmit={handleSubmit}>
        <Container textAlign="left">
          <h2 className={styles.roleToOrgTitle}>Collaborator permission:</h2>
          <Form.Field>
            <Checkbox
              radio
              name="permission"
              label="Admin"
              value="ADMIN"
              checked={permission === 'ADMIN'}
              onChange={handleChangeRadio}
            />
            <p className={styles.note}>
              Can read, clone and push to this repository. Can also manage issues, pull requests, and repository
              settings, including adding collaborators.{' '}
            </p>
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              name="permission"
              label="Write"
              value="WRITE"
              checked={permission === 'WRITE'}
              onChange={handleChangeRadio}
            />
            <p className={styles.note}>
              Can read and clone this repository. Can also manage issues and pull requests.{' '}
            </p>
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              name="permission"
              label="Read"
              value="READ"
              checked={permission === 'READ'}
              onChange={handleChangeRadio}
            />
            <p className={styles.note}>
              Can read and clone this repository. Can also open and comment on issues and pull requests.{' '}
            </p>
          </Form.Field>
          <Divider />
          <Button type="submit" positive>
            Send invitation
          </Button>
        </Container>
      </Form>
    );
  };

  render() {
    const { username } = this.state;
    return !username ? (
      this.renderCollaboratorsPage()
    ) : (
      <Formik
        initialValues={{
          permission: ''
        }}
        validationSchema={permissionValidationSchema}
        onSubmit={this.submitCollaboratorAddition}
        render={this.renderChoosePermission}
      />
    );
  }
}

CollaboratorsPage.propTypes = {
  userId: PropTypes.string.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.object
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({
  userId: id
});

export default connect(mapStateToProps)(CollaboratorsPage);
