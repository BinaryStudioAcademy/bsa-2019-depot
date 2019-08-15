import React from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { signupRoutine } from '../../routines/routines';
import GoogleAuth from '../../components/GoogleAuth';
import { InputError } from '../../components/InputError';
import { serverUrl } from '../../app.config';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username address is required!')
    .matches(
      /^(([a-zA-Z0-9]+-)*[a-zA-Z0-9]+){1,39}$/,
      'Username contains of only alphanumeric characters or single hyphens. Cannot begin or end with a hyphen. Cannot have multiple consecutive hyphens'
    ),
  email: Yup.string()
    .email('Invalid email address!')
    .matches(
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email address!'
    )
    .required('Email address is required!'),
  password: Yup.string()
    .matches(
      /^(?:(?=\D*\d)(?=[^a-z]*[a-z]).{8,}|[a-zA-Z0-9]{15,})$/,
      'Minimum length - 8 characters, if it includes a number and a lowercase letter OR 15 characters with any combination of characters'
    )
    .required('Password is required')
    .max(72)
});

class Signup extends React.Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.renderSignupForm = this.renderSignupForm.bind(this);
  }

  submit(values) {
    const user = {
      username: values.username,
      email: values.email,
      password: values.password
    };
    this.props.signupRoutine({
      user
    });
  }

  renderSignupForm({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
    const { loading, error } = this.props;
    return (
      <Form name="signupForm" size="large" onSubmit={handleSubmit} loading={loading} error={!!error}>
        <Segment textAlign="left">
          <Form.Field required>
            <label htmlFor="username">Username</label>
            <Form.Input
              fluid
              placeholder="Username"
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`${errors.username && touched.username ? 'has-error' : 'no-error'}`}
            />
            <InputError name="username" />
          </Form.Field>
          <Form.Field required>
            <label htmlFor="email">Email</label>
            <Form.Input
              fluid
              placeholder="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`${errors.email && touched.email ? 'has-error' : 'no-error'}`}
            />
            <InputError name="email" />
          </Form.Field>
          <Form.Field required>
            <label htmlFor="password">Password</label>
            <Form.Input
              fluid
              placeholder="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`${errors.password && touched.password ? 'has-error' : 'no-error'}`}
            />
            <InputError name="password" />
          </Form.Field>

          <Button
            type="submit"
            color="green"
            fluid
            size="large"
            disabled={
              (errors.password && touched.password) ||
              (errors.email && touched.email) ||
              (errors.username && touched.username)
            }
          >
            Sign Up for Depot
          </Button>
          <Grid.Column className="google-button">{this.renderGoogleAuth()}</Grid.Column>
          <Message error content={error} />
        </Segment>
        <Message className="login-label">
          Already have an account?{' '}
          <NavLink exact to="/login">
            Sign in
          </NavLink>
        </Message>
      </Form>
    );
  }

  renderGoogleAuth = () => {
    const serverLoginUrl = `${serverUrl}/api/auth/google`;
    return <GoogleAuth text="Sign up with Google" link={serverLoginUrl} />;
  };

  renderSignup = () => {
    return (
      <Grid.Row>
        <Grid.Column className="grid-column">
          <Header as="h2" color="black" textAlign="center">
            Join Depot
          </Header>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: ''
            }}
            validationSchema={validationSchema}
            onSubmit={this.submit}
            render={this.renderSignupForm}
          />
        </Grid.Column>
      </Grid.Row>
    );
  };

  renderForms = () => {
    return (
      <Grid textAlign="center" centered className="signup-grid">
        {this.renderSignup()}
      </Grid>
    );
  };

  render() {
    const { isAuthorized } = this.props;
    return isAuthorized ? <Redirect to="/" /> : this.renderForms();
  }
}

Signup.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  signupRoutine: PropTypes.func.isRequired,
  signupError: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  error: PropTypes.string
};

const mapStateToProps = ({ profile: { isAuthorized, loading, signupError } }) => {
  return {
    isAuthorized,
    loading,
    signupError
  };
};

const mapDispatchToProps = { signupRoutine };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
