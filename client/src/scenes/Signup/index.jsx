import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Grid, Header, Form, Button, Segment, Label, Message } from 'semantic-ui-react';
import { signupRoutine } from '../../routines/routines';

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
      this.props.signupRoutine({
          user,
          history: this.props.history
      });
  };

  render() {
      const { username, email, password } = this.state;
      const { loading, error } = this.props;

      const formValid = ['username', 'email', 'password'].every(
          field => this.state[field].valid && this.state[field].value
      );

      return !this.props.isAuthorized ? (
          <Grid textAlign="center" centered className="signup-grid">
              <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
            Join Depot
                  </Header>
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
              </Grid.Column>
          </Grid>
      ) : (
          <Redirect to="/" />
      );
  }
}

Signup.propTypes = {
    isAuthorized: PropTypes.bool,
    signupRoutine: PropTypes.func,
    error: PropTypes.string,
    loading: PropTypes.bool,
    history: PropTypes.object
};

const mapStateToProps = ({ profile: { isAuthorized, loading, error } }) => {
    return {
        isAuthorized,
        loading,
        error
    };
};

const mapDispatchToProps = { signupRoutine };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup);
