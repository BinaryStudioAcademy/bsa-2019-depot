import React, { Component, Fragment } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import { authorizeUser } from '../../routines/routines';

import './styles.module.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailValid: true,
      isPasswordValid: true
    };
  }

  componentDidMount() {
    if (this.props.error) {
      this.notify();
    }
  }

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

  notify = () => toast(this.props.error, { type: toast.TYPE.ERROR, hideProgressBar: true });

  render() {
    const { isEmailValid, isPasswordValid } = this.state;
    const { loading } = this.props;

    return !this.props.isAuthorized ? (
      <Fragment>
        <Grid textAlign="center" verticalAlign="middle" className="login-grid">
          <Grid.Column className="grid-column">
            <Header as="h2" color="black" textAlign="center" className="login-header">
              Sign in to Depot
            </Header>
            <Form name="loginForm" size="large" onSubmit={this.handleClickLogin}>
              <Segment>
                <Form.Input
                  fluid
                  label="Email"
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
                <Button type="submit" color="green" fluid size="large" loading={loading}>
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
          </Grid.Column>
        </Grid>
        <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      </Fragment>
    ) : (
      <Redirect to="/" />
    );
  }
}
Login.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  authorizeUser: PropTypes.func.isRequired
};

Login.defaultProps = {
  error: ''
};

const mapStateToProps = ({ profile: { isAuthorized, loading, error } }) => ({
  isAuthorized,
  loading,
  error
});

const mapDispatchToProps = {
  authorizeUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
