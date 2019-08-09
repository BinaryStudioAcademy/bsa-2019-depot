import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';

//Actions
import { authActions } from '../../sagas/auth/actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false,
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
      const { isLoading, email, password } = this.state;
      const { actions } = this.props;
      const valid = this.validateForm();
      if (!valid || isLoading) {
          return;
      }
      this.setState({ isLoading: true });
      try {
          await actions.loginAsync({ email, password });
      } catch (error) {
          this.setState({ isLoading: false });
      }
  };

  render() {
      const { isLoading, isEmailValid, isPasswordValid } = this.state;
      return !this.props.isAuthorized ? (
          <Grid textAlign="center" verticalAlign="middle" className="fill">
              <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
            Sign in to Depot
                  </Header>
                  <Form name="loginForm" size="large" onSubmit={this.handleClickLogin}>
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
                          <Button type="submit" color="blue" fluid size="large" loading={isLoading}>
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
      ) : (
          <Redirect to="/" />
      );
  }
}
Login.propTypes = {
    isAuthorized: PropTypes.bool,
    actions: PropTypes.object,
    isLoading: PropTypes.bool
};

Login.defaultProps = {
    isAuthorized: false,
    isLoading: false
};

const mapStateToProps = state => ({
    isAuthorized: state.auth.isAuthorized
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ ...authActions }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
