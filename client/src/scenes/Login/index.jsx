import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';
import * as queryString from 'query-string';

import { Grid, Header, Form, Button, Segment, Message, Label } from 'semantic-ui-react';
import GoogleAuth from '../../components/GoogleAuth';

import { login, loginGoogle, setUsername } from './actions';

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
      const { history, loginGoogle } = this.props;
      if (user) {
          loginGoogle({
              user,
              history
          });
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
      const { loading, login, history } = this.props;
      const valid = this.validateForm();
      if (!valid || loading) {
          return;
      }
      login({
          username: email,
          password,
          history
      });
  };

  handleClickSetUsername = () => {
      const { username } = this.state;
      const { loading, profile, history } = this.props;
      if (loading) {
          return;
      }
      this.props.setUsername({
          username: username.value,
          profile,
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
      const serverLoginURL = `${process.env.REACT_APP_SERVER_URL}/auth/google`;
      return <GoogleAuth text="Sign in with Google" link={serverLoginURL}></GoogleAuth>;
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
              <Header as="h2" color="blue" textAlign="center">
          Join Depot
              </Header>
              <Grid.Row columns={1}>
                  <Grid.Column style={{ maxWidth: 450 }}>
                      <Form
                          name="setusernameForm"
                          size="large"
                          onSubmit={this.handleClickSetUsername}
                          loading={loading}
                          error={!!error}
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
                                      //   onBlur={this.validateHandler}
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
                              <Button type="submit" color="blue" fluid size="large" disabled={!username.valid}>
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
      const { loading, error, profile, isAuthorized } = this.props;
      if (isAuthorized && profile && profile.usernameExists) {
          return <Redirect to="/" />;
      }

      if (profile && !profile.usernameExists) {
          return <>{this.renderSetUsername()}</>;
      }

      return (
          <Grid textAlign="center" verticalAlign="middle" className="fill login-grid">
              <Grid.Row columns={2}>
                  <Grid.Column style={{ maxWidth: 450 }}>
                      <Header as="h2" color="blue" textAlign="center">
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
                              <Form.Input
                                  fluid
                                  placeholder="Password"
                                  type="password"
                                  error={!isPasswordValid}
                                  onChange={this.passwordChangeHandler()}
                                  onBlur={this.validatePassword}
                              />
                              <Button type="submit" color="blue" fluid size="large">
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
    isAuthorized: PropTypes.bool,
    login: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.object,
    error: PropTypes.string,
    location: PropTypes.object,
    loginGoogle: PropTypes.func,
    setUsername: PropTypes.func,
    profile: PropTypes.object
};

const mapStateToProps = state => ({
    isAuthorized: state.auth.isAuthorized,
    loading: state.auth.loading,
    error: state.auth.error,
    profile: state.auth.profile
});

const mapDispatchToProps = { login, loginGoogle, setUsername };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
