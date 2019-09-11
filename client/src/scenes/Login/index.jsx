import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as queryString from 'query-string';
import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import GoogleAuth from '../../components/GoogleAuth';
import { InputError } from '../../components/InputError';
import { serverUrl } from '../../app.config';
import { authorizeUser, loginGoogleRoutine, setUsernameRoutine } from '../../routines/routines';
import { checkUsernameExists } from '../../services/userService';
import * as elasticHelper from '../../helpers/elasticsearchHelper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import debounce from 'debounce-promise';

import './styles.module.scss';

const isUsernameValid = async username => {
  const { usernameExists } = await debouncedCheckUsernameExists(username);
  return !usernameExists;
};

const debouncedCheckUsernameExists = debounce(checkUsernameExists, 500);

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address!')
    .matches(
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email address!'
    )
    .required('Email address is required!')
    .max(100),
  password: Yup.string()
    .matches(
      /^(?:(?=\D*\d)(?=[^a-z]*[a-z]).{8,}|[a-zA-Z0-9]{15,})$/,
      'Minimum length - 8 characters, and includes a number and a lowercase letter'
    )
    .required('Password is required')
    .max(72)
});

const usernameValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required!')
    .matches(/^(([a-zA-Z0-9]+-)*[a-zA-Z0-9]+){1,39}$/)
    .test('username', 'This username is already taken', isUsernameValid)
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
    const { username } = values;
    this.props.setUsernameRoutine({
      username,
      user: currentUser,
      history
    });
    elasticHelper.addUser(username);
  }

  renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
    return (
      <Grid textAlign="center" verticalAlign="middle" className="login-grid">
        <Grid.Row>
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
                <InputError name="email" />
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
                  <InputError name="password" />
                </Form.Field>
                <Button
                  type="submit"
                  color="blue"
                  fluid
                  size="large"
                  disabled={(errors.password && touched.password) || (errors.email && touched.email)}
                >
                  Sign In
                </Button>
                <Grid.Row className="google-button">{this.renderGoogleAuth()}</Grid.Row>
              </Segment>
            </Form>
            <Message>
              New to Depot?{' '}
              <NavLink exact to="/registration">
                Create an account
              </NavLink>
            </Message>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  renderSetUsernameComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
    const { loading, error } = this.props;
    return (
      <Grid textAlign="center" centered className="signup-grid">
        <Grid.Row>
          <Grid.Column className="grid-column">
            <Header as="h2" color="black" textAlign="center">
              Join Depot
            </Header>
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
                  <InputError name="username" />
                </Form.Field>
                <Button type="submit" color="blue" fluid size="large" disabled={errors.username && touched.username}>
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
