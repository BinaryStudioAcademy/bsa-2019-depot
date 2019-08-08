import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { forgotActions } from './actions';

import './styles.module.scss';

class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
            isEmailValid: true
        };
    }

  validateEmail = () => {
      const { email } = this.state;
      const isEmailValid = !validator.isEmpty(email);
      this.setState({ isEmailValid });
      return isEmailValid;
  };

  emailChangeHandler = createHandler(ev => {
      this.emailChanged(ev.target.value);
  });

  emailChanged = email => this.setState({ email, isEmailValid: true });

  validateForm = () => [this.validateEmail()].every(Boolean);

  handleClickForgot = async () => {
      const { isLoading, email } = this.state;
      const { actions } = this.props;
      const valid = this.validateForm();
      if (!valid || isLoading) {
          return;
      }
      this.setState({ isLoading: true });
      try {
          await actions.forgotAsync({ email });
          this.setState({ isLoading: false });
      } catch (error) {
          this.setState({ isLoading: false });
      }
  };

  render() {
      const { isLoading, isEmailValid } = this.state;
      const { isAuthorized, message, emailNotExist, emailSend } = this.props;
      const succsessMessage = emailSend ? <Message color="teal">{message}</Message> : null;
      const failureMessage = emailNotExist ? <Message color="red">{message}</Message> : null;
      return !isAuthorized ? (
          <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle" className="forgot-grid fill">
              <Grid.Column style={{ maxWidth: 400 }}>
                  <Header as="h2" color="black" textAlign="center" className="forgot-header">
            Reset your password
                  </Header>
                  {succsessMessage}
                  <Form name="forgotForm" size="large" onSubmit={this.handleClickForgot} disabled={emailSend}>
                      <Segment>
                          <Form.Input
                              fluid
                              label="Enter your email address and we will send you a link to reset your password."
                              disabled={emailSend}
                              placeholder="Enter your email address"
                              type="email"
                              error={!isEmailValid || emailNotExist}
                              onChange={this.emailChangeHandler()}
                              onBlur={this.validateEmail}
                          />
                          <Button type="submit" color="green" fluid size="large" loading={isLoading} disabled={emailSend}>
                Send password reset email
                          </Button>
                      </Segment>
                      {failureMessage}
                  </Form>
              </Grid.Column>
          </Grid>
      ) : (
          <Redirect to="/" />
      );
  }
}
Forgot.propTypes = {
    isAuthorized: PropTypes.bool,
    message: PropTypes.string,
    emailNotExist: PropTypes.bool,
    emailSend: PropTypes.bool,
    actions: PropTypes.object,
    isLoading: PropTypes.bool
};

Forgot.defaultProps = {
    isAuthorized: false,
    isLoading: false,
    message: '',
    emailNotExist: false,
    emailSend: false
};

const mapStateToProps = state => ({
    isAuthorized: state.auth.isAuthorized,
    message: state.forgot.message,
    emailNotExist: state.forgot.emailNotExist,
    emailSend: state.forgot.emailSend
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ ...forgotActions }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Forgot);
