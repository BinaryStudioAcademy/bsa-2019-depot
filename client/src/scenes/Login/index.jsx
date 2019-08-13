import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as queryString from 'query-string';
import { Grid, Header, Form, Button, Segment, Message, Label } from 'semantic-ui-react';
import GoogleAuth from '../../components/GoogleAuth';
import { serverUrl } from '../../app.config';
import { authorizeUser, loginGoogleRoutine, setUsernameRoutine } from '../../routines/routines';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address!')
    .required('Email address is required!')
    .max(100),
  password: Yup.string()
    .matches(/^(?=.*\d[a-z]).{8,}|([a-zA-Z0-9]{15,})$/)
    .required('Password is required')
    .max(72)
});

const usernameValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username address is required!')
    .matches(/^(([a-z0-9]+-)*[a-z0-9]+){1,39}$/)
});

class Login extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
    this.submitUsername = this.submitUsername.bind(this);
    this.renderSetUsernameComponent = this.renderSetUsernameComponent.bind(this);
    this.state = {
      username: {
        value: '',
        valid: true
      }
    };
  }

  componentDidMount = () => {
    const user = this.getUserFromQuery();
    if (user) {
      localStorage.setItem('token', user.token);
      delete user.usernameExists;
      delete user.token;
      this.props.loginGoogleRoutine({ user });
    }
  };

  getUserFromQuery = () => {
    if (!this.props.location.search) {
      return null;
    }
    const userString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).user;
    return JSON.parse(userString);
  };

  renderGoogleAuth = () => {
    const serverLoginUrl = `${serverUrl}/api/auth/google`;
    return <GoogleAuth text="Sign in with Google" link={serverLoginUrl} />;
  };

  submit(values) {
    this.props.authorizeUser({ username: values.email, password: values.password });
  }

  submitUsername(values) {
    const { currentUser, history } = this.props;
    this.props.setUsernameRoutine({
      username: values.username,
      user: currentUser,
      history
    });
  }

  renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
    return (
      <Grid textAlign="center" verticalAlign="middle" className="login-grid">
        <Grid.Column className="grid-column">
          <Header as="h2" color="black" textAlign="center" className="login-header">
            Sign in to Depot
          </Header>
          <Form name="loginForm" size="large" onSubmit={handleSubmit}>
            <Segment>
              <Form.Input
                fluid
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={`${errors.email && touched.email ? 'has-error' : 'no-error'}`}
              />
              <Form.Field className="password-wrapper">
                <NavLink exact to="/forgot" className="forgot-link">
                  forgot password?
                </NavLink>
                <Form.Input
                  fluid
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className={`${errors.password && touched.password ? 'has-error' : 'no-error'}`}
                />
              </Form.Field>
              <Button
                type="submit"
                color="green"
                fluid
                size="large"
                disabled={(errors.password && touched.password) || (errors.email && touched.email)}
              >
                Sign In
              </Button>
            </Segment>
          </Form>
          <Message>
            New to Depot?{' '}
            <NavLink exact to="/registration">
              Create an account
            </NavLink>
          </Message>
          <Grid.Row>{this.renderGoogleAuth()}</Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }

  renderSetUsernameComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
    const { loading, error } = this.props;
    return (
      <Grid textAlign="center" centered className="signup-grid">
        <Header as="h2" color="black" textAlign="center">
          Join Depot
        </Header>
        <Grid.Row columns={1}>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Form name="setusernameForm" size="large" onSubmit={handleSubmit} loading={loading} error={Boolean(error)}>
              <Segment textAlign="left">
                <p>Please set your Depot username</p>
                <Form.Field required>
                  <label htmlFor="username">Username</label>
                  <Form.Input
                    fluid
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    type="text"
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
                <Button type="submit" color="green" fluid size="large" disabled={errors.username && touched.username}>
                  Set Username
                </Button>
                <Message error content={error} />
              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const { currentUser, isAuthorized } = this.props;
    if (isAuthorized && currentUser.username) {
      return <Redirect to="/" />;
    }
    if (isAuthorized && !currentUser.username) {
      return (
        <Formik
          initialValues={{
            username: ''
          }}
          validationSchema={usernameValidationSchema}
          onSubmit={this.submitUsername}
          render={this.renderSetUsernameComponent}
        />
      );
    }
    return (
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={this.submit}
        render={this.renderComponent}
      />
    );
  }
}

Login.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loginGoogleRoutine: PropTypes.func.isRequired,
  setUsernameRoutine: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  authorizeUser: PropTypes.func.isRequired
};
const mapStateToProps = ({ profile: { isAuthorized, loading, error, currentUser } }) => ({
  isAuthorized,
  loading,
  error,
  currentUser
});
const mapDispatchToProps = { authorizeUser, loginGoogleRoutine, setUsernameRoutine };
Login.defaultProps = {
  error: ''
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
