import React from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Form, Search, Button } from 'semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';
import { getUsersForCollaboratorsAddition } from '../../services/userService';

import styles from './styles.module.scss';

const permissionValidationSchema = Yup.object().shape({
  Permission: Yup.string().required('Permission is required!')
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
      // isLoading: false,
      // results: [],
      // value: '',
      collaborators: [],
      repositoryId: null
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const { id } = await getRepositoryByOwnerAndName({ username, reponame });
    this.setState({
      repositoryId: id
    });
  }

  handleSearchChange = async (e, { value }) => {
    const { repositoryId } = this.state;
    this.setState({ isLoading: true, value });
    if (!value) return this.setState(initialState);
    // if (!value) return this.setState({
    //   isLoading: false,
    //   results: [],
    //   value: ''
    // });

    const users = await getUsersForCollaboratorsAddition(value, repositoryId);
    const results = users.map(user => ({
      content: user
    }));
    this.setState({
      isLoading: false,
      results
    });
  };

  resultRenderer = ({ content }) => <p>{content}</p>;

  submitCollaboratorAddition = values => {
    // console.log('id: ', id);
    // const { history, match } = this.props;
    // const { name } = match.params;
    // const { username } = this.state;
    // const { role } = values;
    // invite({
    //   orgName: name,
    //   username,
    //   role
    // });
    // history.push(`/${name}`);
  };

  renderCollaboratorsPage = () => {
    const { collaborators, isLoading, value, results } = this.state;
    // const { name } = this.props.match.params;

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
    // const { name } = this.props.match.params;
    // const { username } = this.state;
    // const { permission } = values;
    // const handleChangeRadio = this.handleChangeRadio(handleChange);
    // const rolesDescription = this.getRolesDescription();

    return (
      <Form className={styles.formField} onSubmit={handleSubmit}>
        <Container textAlign="left">
          />
          <h2 className={styles.roleToOrgTitle}>Collaborator permission:</h2>
          {/* {rolesDescription.map(role => role)} */}
          {/* <Form.Field>
            <Checkbox
              radio
              name="role"
              label="Member"
              value="MEMBER"
              checked={role === 'MEMBER'}
              onChange={handleChangeRadio}
            />
            <p className={styles.note}>
              Members can see all other members, and can be granted access to repositories. They can also create new
              teams and repositories.{' '}
            </p>
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              name="role"
              label="Owner"
              value="OWNER"
              checked={role === 'OWNER'}
              onChange={handleChangeRadio}
            />
            <p className={styles.note}>
              Owners have full administrative rights to the organization and have complete access to all repositories
              and teams.{' '}
            </p>
          </Form.Field> */}
          <Divider />
          <Button type="submit" positive fluid>
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
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default CollaboratorsPage;
