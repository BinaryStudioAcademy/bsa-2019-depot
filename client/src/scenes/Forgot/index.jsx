import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';

//Actions
import { authActions } from '../../sagas/auth/actions';

class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
            isEmailValid: true,
            currentEmail: ''
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
          await actions.loginAsync({ email }); //TODO need change action
          this.setState({ currentEmail: email });
          this.setState({ isLoading: false });
      } catch (error) {
          this.setState({ isLoading: false });
      }
  };

  render() {
      const { isLoading, isEmailValid, currentEmail } = this.state;
      const succsessMessage = currentEmail ? (
          <Message color="teal">The email was successfully sent to {currentEmail}</Message>
      ) : null;
      return !this.props.isAuthorized ? (
          <Grid textAlign="center" verticalAlign="middle" className="fill">
              <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
            Forgot password?
                  </Header>
                  {succsessMessage}
                  <Form name="forgotForm" size="large" onSubmit={this.handleClickForgot}>
                      <Segment>
                          <Form.Input
                              fluid
                              placeholder="Email"
                              type="email"
                              error={!isEmailValid}
                              onChange={this.emailChangeHandler()}
                              onBlur={this.validateEmail}
                          />
                          <Button type="submit" color="blue" fluid size="large" loading={isLoading}>
                Reset password
                          </Button>
                      </Segment>
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
    actions: PropTypes.object,
    isLoading: PropTypes.bool
};

Forgot.defaultProps = {
    isAuthorized: false,
    isLoading: false,
    currentEmail: ''
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
)(Forgot);
