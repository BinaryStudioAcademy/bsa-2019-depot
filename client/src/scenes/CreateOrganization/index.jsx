import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Header, Divider, Step, Icon, Button, Input } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import { createOrg } from '../../routines/routines';
import * as Yup from 'yup';

import PropTypes from 'prop-types';

class CreateOrganization extends Component {
  renderField = ({ field }) => <Input fluid {...field} />;

  newOrgSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required')
  });

  onSubmit = (values, { setSubmitting }) => {
    this.props.createOrg(values);
  };

  render() {
    const initialValues = { username: '', email: '' };
    const { company, loading, error: serverError } = this.props;

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

          <Formik initialValues={initialValues} onSubmit={this.onSubmit} validationSchema={this.newOrgSchema}>
            {({ isSubmitting, errors, touched }) => (
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
                    <Field type="text" name="username" render={this.renderField} />
                    {errors.username && touched.username ? (
                      <div className={styles.error}>{errors.username}</div>
                    ) : serverError ? (
                      <div className={styles.error}>{serverError}</div>
                    ) : (
                      <div className={styles.note}>This will be your organization name on https://depothub.xyz/.</div>
                    )}
                  </Grid.Column>
                </Grid>
                <Header as="h4" className={styles.field_title}>
                  Billing email
                </Header>

                <Grid>
                  <Grid.Column computer={8} tablet={12} mobile={16}>
                    <Field type="email" name="email" render={this.renderDisabledField} />
                    {errors.email && touched.email ? (
                      <div className={styles.error}>{errors.email}</div>
                    ) : (
                      <div className={styles.note}>We’ll send receipts to this inbox.</div>
                    )}
                  </Grid.Column>
                </Grid>

                <Divider hidden />
                <div>
                  By clicking on "Create organization" below, you are agreeing to the{' '}
                  <Link to="#">Terms of Service</Link>. For more information about GitHub's privacy practices, see the
                  <Link to="#"> GitHub Privacy Statement</Link>.
                </div>
                <Divider hidden />

                <Button color="green" type="submit" disabled={loading}>
                  Create otganization
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
  error: PropTypes.string
};

const mapStateToProps = state => ({ ...state.createOrg });

const mapDispatchToProps = { createOrg };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrganization);
