import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import * as queryString from 'query-string';
import { Grid, Header, Form, Button, Segment, Message, Label } from 'semantic-ui-react';
import GoogleAuth from '../../components/GoogleAuth';
import appConfig from '../../app.config';
import { authorizeUser, loginGoogleRoutine, setUsernameRoutine } from '../../routines/routines';

import './styles.module.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailValid: true,
      isPasswordValid: true,
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

  validateEmail = () => {
    const { email } = this.state;
    const isEmailValid = !validator.isEmpty(email);
    this.setState({ isEmailValid });
    return isEmailValid;
  };

  validatePassword = () => {
    const { password } = this.state;
    const isPasswordValid = !validator.isEmpty(password);
    this.setState({ isPasswordValid });
    return isPasswordValid;
  };

  emailChangeHandler = createHandler(ev => {
    this.emailChanged(ev.target.value);
  });

  passwordChangeHandler = createHandler(ev => {
    this.passwordChanged(ev.target.value);
  });

  emailChanged = email => this.setState({ email, isEmailValid: true });

  passwordChanged = password => this.setState({ password, isPasswordValid: true });

  validateForm = () => [this.validateEmail(), this.validatePassword()].every(Boolean);

  handleClickLogin = async () => {
    const { email, password } = this.state;
    const valid = this.validateForm();
    if (!valid || this.props.loading) {
      return;
    }
    this.props.authorizeUser({ username: email, password });
  };

  handleClickSetUsername = () => {
    const { username } = this.state;
    const { loading, currentUser, history } = this.props;
    if (loading) {
      return;
    }
    this.props.setUsernameRoutine({
      username: username.value,
      user: currentUser,
      history
    });
  };

  getUserFromQuery = () => {
    if (!this.props.location.search) {
      return null;
    }
    const userString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).user;
    return JSON.parse(userString);
  };

  renderGoogleAuth = () => {
    const serverLoginURL = `${appConfig.SERVER_URL}/api/auth/google`;
    return <GoogleAuth text="Sign in with Google" link={serverLoginURL} />;
  };

  validateUsername = value => {
    return (
      !validator.isEmpty(value) &&
      validator.matches(value, '(^[\\d\\w]*(?:[a-zA-Z0-9]|-(?!-))*[\\d\\w]$)|(^[\\d\\w]$)', 'ig')
    );
  };

  usernameChangeHandler = evt => {
    const { value } = evt.target;
    const valid = this.validateUsername(value);
    this.setState({
      ...this.state,
      username: {
        value,
        valid
      }
    });
  };

  renderSetUsername = () => {
    const { loading, error } = this.props;
    const { username } = this.state;
    return (
      <Grid textAlign="center" centered className="signup-grid">
        <Header as="h2" color="black" textAlign="center">
          Join Depot
        </Header>
        <Grid.Row columns={1}>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Form
              name="setusernameForm"
              size="large"
              onSubmit={this.handleClickSetUsername}
              loading={loading}
              error={Boolean(error)}
            >
              <Segment textAlign="left">
                <p>Please set your Depot username</p>
                <Form.Field required>
                  <label htmlFor="username">Username</label>
                  <Form.Input
                    fluid
                    placeholder="Username"
                    name="username"
                    type="text"
                    error={!username.valid}
                    onChange={this.usernameChangeHandler}
                    required
                    icon={{
                      name: 'check',
                      className: `icon-green ${username.value && username.valid ? '' : 'icon-hidden'}`
                    }}
                  />
                  <Label className="signup-pointing-label" pointing>
                    Username can contain alphanumeric characters and single hyphens, cannot begin or end with a hyphen
                  </Label>
                </Form.Field>
                <Button type="submit" color="green" fluid size="large" disabled={!username.valid}>
                  Set Username
                </Button>
                <Message error content={error} />
              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  render() {
    const { isEmailValid, isPasswordValid } = this.state;
    const { loading, error, currentUser, isAuthorized } = this.props;
    if (isAuthorized && currentUser.username) {
      return <Redirect to="/" />;
    }

    if (isAuthorized && !currentUser.username) {
      return <>{this.renderSetUsername()}</>;
    }
    return (
      <Grid textAlign="center" verticalAlign="middle" className="login-grid">
        <Grid.Row columns={2}>
          <Grid.Column className="grid-column">
            <Header as="h2" color="black" textAlign="center">
              Sign in to Depot
            </Header>
            <Form name="loginForm" size="large" onSubmit={this.handleClickLogin} loading={loading} error={!!error}>
              <Segment>
                <Form.Input
                  fluid
                  placeholder="Email"
                  type="email"
                  error={!isEmailValid}
                  onChange={this.emailChangeHandler()}
                  onBlur={this.validateEmail}
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
                    error={!isPasswordValid}
                    onChange={this.passwordChangeHandler()}
                    onBlur={this.validatePassword}
                  />
                </Form.Field>
                <Button type="submit" color="green" fluid size="large">
                  Sign In
                </Button>
                <Message error content={error} />
              </Segment>
            </Form>
            <Message>
              New to Depot?{' '}
              <NavLink exact to="/registration">
                Create an account
              </NavLink>
            </Message>
          </Grid.Column>

          <Grid.Column style={{ maxWidth: 300 }}>{this.renderGoogleAuth()}</Grid.Column>
        </Grid.Row>
      </Grid>
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
