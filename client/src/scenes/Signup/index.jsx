import React from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Button, Segment, Label, Message } from 'semantic-ui-react';
import { signupRoutine } from '../../routines/routines';
import GoogleAuth from '../../components/GoogleAuth';
import { serverUrl } from '../../app.config';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username address is required!')
    .matches(/^(([a-z0-9]+-)*[a-z0-9]+){1,39}$/),
  email: Yup.string()
    .email('Invalid email address!')
    .required('Email address is required!'),
  password: Yup.string()
    .matches(/^(?=.*\d[a-z]).{8,}|([a-zA-Z0-9]{15,})$/)
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
            {errors.username && touched.username && (
              <Label className="signup-pointing-label" pointing>
                Username can contain alphanumeric characters and single hyphens, cannot begin or end with a hyphen
              </Label>
            )}
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
            {errors.email && touched.email && (
              <Label className="signup-pointing-label" pointing>
                Invalid email address
              </Label>
            )}
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
            {errors.password && touched.password && (
              <Label className="signup-pointing-label" pointing>
                Password should be at least 8 characters, if it includes a number and a lowercase letter or 15
                characters with any combination of characters
              </Label>
            )}
          </Form.Field>

          <Button
            type="submit"
            color="blue"
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
      <Grid.Row columns={2}>
        <Grid.Column style={{ maxWidth: 450 }}>
          {' '}
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
        <Header as="h2" color="black" textAlign="center">
          Join Depot
        </Header>
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
