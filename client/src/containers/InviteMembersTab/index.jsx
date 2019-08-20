import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Icon, Container, Input, Button, Form, Divider, Checkbox } from 'semantic-ui-react';
import * as Yup from 'yup';

import { invite } from '../../services/inviteMemberService';
import styles from './styles.module.scss';

const usernameValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required!')
    .matches(/^(([a-zA-Z0-9]+-)*[a-zA-Z0-9]+){1,39}$/)
});

const roleValidationSchema = Yup.object().shape({
  role: Yup.string().required('Role is required!')
});

class InviteMembersTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };
  }

  submitUsername = values => {
    const { username } = values;
    this.setState({
      username
    });
  };

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
    history.push(`/orgs/${name}`);
  };

  handleChangeRadio = handleChange => (e, data) => {
    const { name, value } = data;
    e.target.name = name;
    e.target.value = value;
    handleChange(e);
  };

  renderInputUsername = ({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => {
    const { name } = this.props.match.params;
    const { username } = values;
    return (
      <Form size="large" onSubmit={handleSubmit}>
        <Container textAlign="center">
          <Icon className={styles.emailIcon} name="mail outline" size="big" />
          <Form.Field required>
            <h1 className={styles.addToOrgTitle}>Invite member to {name}</h1>
            <Input
              className={styles.usernameInput}
              icon="user"
              iconPosition="left"
              placeholder="Username"
              name="username"
              value={username}
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              action={
                <Button color="teal" type="submit">
                  Invite
                </Button>
              }
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
          <Divider hidden />
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
      <Formik
        initialValues={{
          username: ''
        }}
        validationSchema={usernameValidationSchema}
        onSubmit={this.submitUsername}
        render={this.renderInputUsername}
      />
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
  history: PropTypes.object
};

export default withRouter(InviteMembersTab);
