import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Icon, Container, Button, Form, Divider, Checkbox, Search } from 'semantic-ui-react';

import { invite } from '../../services/inviteMemberService';
import { getUsersToInviting } from '../../services/userService';

import * as Yup from 'yup';
import styles from './styles.module.scss';

const roleValidationSchema = Yup.object().shape({
  role: Yup.string().required('Role is required!')
});

const initialState = {
  isLoading: false,
  results: [],
  value: ''
};

class InviteMembersTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      ...initialState
    };
  }

  handleResultSelect = (e, { result }) => this.setState({ username: result.content });

  handleSearchChange = async (e, { value }) => {
    const { orgId } = this.props;
    this.setState({ isLoading: true, value });
    if (!value) return this.setState(initialState);

    const users = await getUsersToInviting(value, orgId);
    const results = users.map(user => ({
      content: user
    }));
    this.setState({
      isLoading: false,
      results
    });
  };

  resultRenderer = ({ content }) => <p>{content}</p>;

  submitInvite = values => {
    const { history, match } = this.props;
    const { name } = match.params;
    const { username } = this.state;
    const { role } = values;

    invite({
      orgName: name,
      username,
      role
    });
    history.push(`/${name}`);
  };

  handleChangeRadio = handleChange => (e, data) => {
    const { name, value } = data;
    e.target.name = name;
    e.target.value = value;
    handleChange(e);
  };

  renderInputUsername = () => {
    const { isLoading, value, results } = this.state;
    const { name } = this.props.match.params;

    return (
      <Form size="large">
        <Container textAlign="center">
          <Icon className={styles.emailIcon} name="mail outline" size="big" />
          <Form.Field>
            <h1 className={styles.addToOrgTitle}>Invite member to {name}</h1>
            <Search
              className={styles.usernameSearch}
              placeholder="Username"
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={this.handleSearchChange}
              results={results}
              value={value}
              resultRenderer={this.resultRenderer}
            />
          </Form.Field>
        </Container>
      </Form>
    );
  };

  renderChooseRole = ({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => {
    const { name } = this.props.match.params;
    const { username } = this.state;
    const { role } = values;
    const handleChangeRadio = this.handleChangeRadio(handleChange);

    return (
      <Form className={styles.formField} onSubmit={handleSubmit}>
        <Container textAlign="left">
          <h1 className={styles.editTitle}>
            Invite {username} to {name}
          </h1>
          <Divider />
          <p>
            Give them an appropriate role in the organization and add them to some teams to give access to repositories.{' '}
          </p>
          <h2 className={styles.roleToOrgTitle}>Role in organization:</h2>
          <Form.Field>
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
          </Form.Field>
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
      this.renderInputUsername()
    ) : (
      <Formik
        initialValues={{
          role: ''
        }}
        validationSchema={roleValidationSchema}
        onSubmit={this.submitInvite}
        render={this.renderChooseRole}
      />
    );
  }
}

InviteMembersTab.propTypes = {
  match: PropTypes.object,
  id: PropTypes.string,
  history: PropTypes.object,
  orgId: PropTypes.string
};

export default withRouter(InviteMembersTab);
