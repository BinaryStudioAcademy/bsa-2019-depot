import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';

import { login } from './actions';

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

  render() {
      const { isEmailValid, isPasswordValid } = this.state;
      const { loading, error } = this.props;
      return !this.props.isAuthorized ? (
          <Grid textAlign="center" verticalAlign="middle" className="fill login-grid">
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
          </Grid>
      ) : (
          <Redirect to="/" />
      );
  }
}
Login.propTypes = {
    isAuthorized: PropTypes.bool,
    login: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.object,
    error: PropTypes.string
};

const mapStateToProps = state => ({
    isAuthorized: state.auth.isAuthorized,
    loading: state.auth.loading,
    error: state.auth.error
});

const mapDispatchToProps = { login };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
