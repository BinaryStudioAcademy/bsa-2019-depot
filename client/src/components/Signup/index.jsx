import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Message, Segment, Label } from 'semantic-ui-react';

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
            loading: false,
            formValid: true
        };
    }

  validateField = (field, value) => {
      switch (field) {
      case 'username': {
          return !validator.isEmpty(value); // todo: add validate by regexp
      }

      case 'email': {
          return validator.isEmail(value);
      }

      case 'password': {
          return !validator.isEmpty(value);
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
              valid: valid
          }
      });
  };

  changeHandler = evt => {
      const field = evt.target.name;
      const { value } = evt.target;
      this.setState({
          ...this.state,
          [field]: {
              value,
              valid: true
          },
          formValid: true
      });
  };

  validateForm = () => {
      const formValid = ['username', 'email', 'password'].every(field => this.state[field].valid);
      this.setState({
          ...this.state,
          formValid
      });
  };

  handleClickSignup = async () => {
      this.validateForm();

      const { loading, formValid, username, email, password } = this.state;
      if (!formValid || loading) {
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
      const { loading, username, email, password, formValid } = this.state;

      return !this.props.isAuthenticated ? (
          <Grid textAlign="center" centered className="signup-grid">
              <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
            Join Depot
                  </Header>
                  <Form name="signupForm" size="large" onSubmit={this.handleClickSignup} loading={loading} error={!formValid}>
                      <Segment textAlign="left">
                          <Form.Field required>
                              <label htmlFor="username" floating>
                  Username
                              </label>
                              <Form.Input
                                  fluid
                                  placeholder="Username"
                                  name="username"
                                  type="text"
                                  error={!username.valid}
                                  onChange={this.changeHandler}
                                  onBlur={this.validateHandler}
                                  required
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
                              />
                              <Label className="signup-pointing-label" pointing>
                  Password should be at least 8 characters including a number and a lowercase letter
                              </Label>
                          </Form.Field>

                          <Button type="submit" color="blue" fluid size="large">
                Sign Up for Depot
                          </Button>
                          <Message
                              error
                              content="One or more fields are missing or invalid. Please check your input and try again."
                          />
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
