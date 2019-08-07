import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Message, Segment, Label } from 'semantic-ui-react';

import './styles.module.scss';

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
            },
            loading: false
        };
    }

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
      console.warn('changeHandler', this.state);
  };

  handleClickSignup = async () => {
      const { loading, username, email, password } = this.state;
      if (loading) {
          return;
      }
      //   this.setState({ loading: true });
      try {
      // eslint-disable-next-line no-console
          console.log(`register as ${username.value} ${email.value} ${password.value}`);
      //await this.props.signup({ username, email, password });
      } catch {
          this.setState({ loading: false });
      }
  };

  render() {
      const { loading, username, email, password } = this.state;
      const formValid = ['username', 'email', 'password'].every(
          field => this.state[field].valid && this.state[field].value
      );

      return !this.props.isAuthenticated ? (
          <Grid textAlign="center" centered className="signup-grid">
              <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
            Join Depot
                  </Header>
                  <Form name="signupForm" size="large" onSubmit={this.handleClickSignup} loading={loading} error={!formValid}>
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
                          {/* <Message
                              error
                              content="One or more fields are missing or invalid. Please check your input and try again."
                          /> */}
                      </Segment>
                  </Form>
              </Grid.Column>
          </Grid>
      ) : (
          <Redirect to="/" />
      );
  }
}

Signup.propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user
    };
};

// const mapDispatchToProps = { ...actions };

export default connect(
    mapStateToProps,
    // mapDispatchToProps
    null
)(Signup);
