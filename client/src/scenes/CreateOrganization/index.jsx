import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Header, Divider, Step, Icon, Button, Input } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import styles from './styles.module.scss';
import { createOrg } from '../../routines/routines';
import * as Yup from 'yup';
import { InputError } from '../../components/InputError';
import { checkUsernameExists } from '../../services/userService';
import * as elasticHelper from '../../helpers/elasticsearchHelper';
import debounce from 'debounce-promise';
import PropTypes from 'prop-types';

const isUsernameValid = async username => {
  const { usernameExists } = await debouncedCheckUsernameExists(username);
  return !usernameExists;
};

const debouncedCheckUsernameExists = debounce(checkUsernameExists, 500);

class CreateOrganization extends Component {
  renderField = ({ field }) => <Input fluid {...field} />;

  newOrgSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required')
      .test('username', 'This username is already taken', isUsernameValid),
    email: Yup.string()
      .email('Invalid email')
      .required('Required')
  });

  onSubmit = (values, { setSubmitting }) => {
    this.props.createOrg({ ...values });
    const { username } = values;
    elasticHelper.addOrg(username);
  };

  render() {
    const initialValues = { username: '', email: '' };

    const { company, loading, userID } = this.props;

    return company ? (
      <Redirect to={`/${this.props.company}`} />
    ) : (
      <Grid container centered>
        <Grid.Column computer={12} tablet={16} mobile={16}>
          <Divider hidden />
          <Header as="h1">Create an organization</Header>
          <Step.Group>
            <Step>
              <Icon name="users" color="blue" />
              <Step.Content>
                <Step.Title>Step 1:</Step.Title>
                <Step.Description>Set up the organization</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
          <Divider hidden />

          <Formik
            initialValues={{ ...initialValues, userID }}
            onSubmit={this.onSubmit}
            validationSchema={this.newOrgSchema}
          >
            {({ isSubmitting, touched, isValid }) => (
              <Form className="ui form">
                <Header as="h3">
                  Set up the organization
                  <Header.Subheader>
                    Organization accounts allow your team to plan, build, review, and ship software — all while tracking
                    bugs and discussing ideas.
                  </Header.Subheader>
                </Header>
                <Divider />
                <Header as="h4" className={styles.field_title}>
                  Organization name
                </Header>
                <Grid>
                  <Grid.Column computer={8} tablet={12} mobile={16}>
                    <Field
                      type="text"
                      name="username"
                      placeholder="This will be your organization name on https://depothub.xyz/"
                      render={this.renderField}
                    />
                    <InputError name="username" />
                  </Grid.Column>
                </Grid>
                <Header as="h4" className={styles.field_title}>
                  Email
                </Header>

                <Grid>
                  <Grid.Column computer={8} tablet={12} mobile={16}>
                    <Field
                      type="email"
                      name="email"
                      placeholder="We’ll send receipts to this inbox"
                      render={this.renderField}
                    />
                    <InputError name="email" />
                  </Grid.Column>
                </Grid>
                <Divider hidden />
                <Button color="blue" type="submit" disabled={loading || !isValid || !touched}>
                  Create organization
                </Button>
              </Form>
            )}
          </Formik>
        </Grid.Column>
      </Grid>
    );
  }
}

CreateOrganization.propTypes = {
  createOrg: PropTypes.func,
  loading: PropTypes.bool,
  username: PropTypes.string,
  company: PropTypes.string,
  error: PropTypes.string,
  userID: PropTypes.string,
  currentUser: PropTypes.object
};

const mapStateToProps = state => ({ ...state.createOrg, userID: state.profile.currentUser.id });

const mapDispatchToProps = { createOrg };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrganization);
