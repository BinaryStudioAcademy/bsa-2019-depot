import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment, Label, Message } from 'semantic-ui-react';

import './styles.module.scss';

import { signup, googleSignup, setUsername } from './actions';
import GoogleAuth from '../../components/GoogleAuth';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: {
                value: '',
                valid: true
            },
            email: {
                value: '',
                valid: true
            },
            password: {
                value: '',
                valid: true
            }
        };
    }

  componentDidMount = () => {
      this.setState({
          username: {
              value: '',
              valid: true
          },
          email: {
              value: '',
              valid: true
          },
          password: {
              value: '',
              valid: true
          }
      });
  };

  validateField = (field, value) => {
      switch (field) {
      case 'username': {
          return (
              !validator.isEmpty(value) &&
          validator.matches(value, '(^[\\d\\w]*(?:[a-zA-Z0-9]|-(?!-))*[\\d\\w]$)|(^[\\d\\w]$)', 'ig')
          );
      }

      case 'email': {
          return validator.isEmail(value);
      }

      case 'password': {
          return (
              !validator.isEmpty(value) &&
          validator.matches(value, '\\d', 'ig') &&
          validator.matches(value, '[a-z]', 'g') &&
          validator.matches(value, '.{8,}', 'ig')
          );
      }

      default:
          return false;
      }
  };

  validateHandler = evt => {
      const field = evt.target.name;
      const { value } = this.state[field];
      const valid = this.validateField(field, value);
      this.setState({
          ...this.state,
          [field]: {
              value,
              valid
          }
      });
  };

  changeHandler = evt => {
      const field = evt.target.name;
      const { value } = evt.target;
      const valid = this.validateField(field, value);
      this.setState({
          ...this.state,
          [field]: {
              value,
              valid
          }
      });
  };

  handleClickSignup = () => {
      const { username, email, password } = this.state;
      const { loading } = this.props;
      if (loading) {
          return;
      }
      const user = {
          username: username.value,
          email: email.value,
          password: password.value
      };
      this.props.signup({
          user,
          history: this.props.history
      });
  };

  handleClickGoogleSignup = () => {
      this.props.googleSignup();
  };

  handleClickSetUsername = () => {
      const { username } = this.state;
      const { loading } = this.props;
      if (loading) {
          return;
      }
      this.props.setUsername({
          username: username.value,
          history: this.props.history
      });
  };

  renderSignupForm = () => {
      const { username, email, password } = this.state;
      const { loading, error } = this.props;

      const formValid = ['username', 'email', 'password'].every(
          field => this.state[field].valid && this.state[field].value
      );

      return (
          <Form name="signupForm" size="large" onSubmit={this.handleClickSignup} loading={loading} error={!!error}>
              <Segment textAlign="left">
                  <Form.Field required>
                      <label htmlFor="username">Username</label>
                      <Form.Input
                          fluid
                          placeholder="Username"
                          name="username"
                          type="text"
                          error={!username.valid}
                          onChange={this.changeHandler}
                          onBlur={this.validateHandler}
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
                  <Form.Field required>
                      <label htmlFor="email">Email</label>
                      <Form.Input
                          fluid
                          placeholder="Email"
                          name="email"
                          type="email"
                          error={!email.valid}
                          onChange={this.changeHandler}
                          onBlur={this.validateHandler}
                          required
                          icon={{
                              name: 'check',
                              className: `icon-green ${email.value && email.valid ? '' : 'icon-hidden'}`
                          }}
                      />
                  </Form.Field>
                  <Form.Field required>
                      <label htmlFor="password">Password</label>
                      <Form.Input
                          fluid
                          placeholder="Password"
                          name="password"
                          type="password"
                          error={!password.valid}
                          onChange={this.changeHandler}
                          onBlur={this.validateHandler}
                          required
                          icon={{
                              name: 'check',
                              className: `icon-green ${password.value && password.valid ? '' : 'icon-hidden'}`
                          }}
                      />
                      <Label className="signup-pointing-label" pointing>
              Password should be at least 8 characters including a number and a lowercase letter
                      </Label>
                  </Form.Field>

                  <Button type="submit" color="blue" fluid size="large" disabled={!formValid}>
            Sign Up for Depot
                  </Button>
                  <Message error content={error} />
              </Segment>
          </Form>
      );
  };

  renderGoogleAuth = () => {
      return <GoogleAuth text="Sign up with Google" handleClick={this.handleClickGoogleSignup}></GoogleAuth>;
  };

  renderSignup = () => {
      return (
          <Grid.Row columns={3}>
              <Grid.Column style={{ maxWidth: 450 }}>{this.renderSignupForm()}</Grid.Column>
              <Grid.Column style={{ maxWidth: 300 }}>{this.renderGoogleAuth()}</Grid.Column>
              <Grid.Column style={{ maxWidth: 300 }}>
                  <a href="http://localhost:3000/auth/google">DIRECT LINK</a>
              </Grid.Column>
          </Grid.Row>
      );
  };

  renderSetUsername = () => {
      const { loading, error } = this.props;
      const { username } = this.state;
      return (
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
                                  onChange={this.changeHandler}
                                  onBlur={this.validateHandler}
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
      );
  };

  renderForms = () => {
      const { shouldSetUsername } = this.props;
      return (
          <Grid textAlign="center" centered className="signup-grid">
              <Header as="h2" color="blue" textAlign="center">
          Join Depot
              </Header>
              {shouldSetUsername ? this.renderSetUsername() : this.renderSignup()}
          </Grid>
      );
  };

  render() {
      const { isAuthorized } = this.props;
      return isAuthorized ? <Redirect to="/" /> : this.renderForms();
  }
}

Signup.propTypes = {
    isAuthorized: PropTypes.bool,
    user: PropTypes.object,
    signup: PropTypes.func,
    googleSignup: PropTypes.func,
    setUsername: PropTypes.func,
    error: PropTypes.string,
    loading: PropTypes.bool,
    shouldSetUsername: PropTypes.bool,
    history: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isAuthorized: state.auth.isAuthorized,
        user: state.auth.user,
        loading: state.signup.loading,
        error: state.signup.error,
        shouldSetUsername: state.signup.shouldSetUsername
    };
};

const mapDispatchToProps = { signup, googleSignup, setUsername };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup);
