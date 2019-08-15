import React, { Component } from 'react';
import { Grid, Header, Divider, Step, Icon, Button, Input } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

class CreateOrganization extends Component {
  renderField = ({ field }) => <Input fluid {...field} />;

  render() {
    const initialValues = { username: '', email: '' };
    const loading = false;

    return (
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

          <Formik initialValues={initialValues} onSubmit={this.onSubmit}>
            {({ isSubmitting }) => (
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
                    <div className={styles.note}>This will be your organization name on https://depothub.xyz/.</div>
                  </Grid.Column>
                </Grid>
                <Header as="h4" className={styles.field_title}>
                  Billing email
                </Header>

                <Grid>
                  <Grid.Column computer={8} tablet={12} mobile={16}>
                    <Field type="email" name="email" render={this.renderDisabledField} />
                    <div className={styles.note}>We’ll send receipts to this inbox.</div>
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
export default CreateOrganization;
