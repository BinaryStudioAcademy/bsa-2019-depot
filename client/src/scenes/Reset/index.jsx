import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { resetActions } from './actions';

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      repeatPassword: '',
      isLoading: false,
      isPasswordValid: true,
      isRepeatPasswordValid: true,
      isConfirmedPassword: true,
      redirect: false
    };
  }

  validatePassword = () => {
    const { password } = this.state;
    const isPasswordValid = !validator.isEmpty(password);
    this.setState({ isPasswordValid });
    return isPasswordValid;
  };

  validateRepeatPassword = () => {
    const { repeatPassword } = this.state;
    const isRepeatPasswordValid = !validator.isEmpty(repeatPassword);
    this.setState({ isRepeatPasswordValid });
    return isRepeatPasswordValid;
  };

  confirmPassword = () => {
    const { password, repeatPassword } = this.state;
    const isConfirmedPassword = password === repeatPassword;
    this.setState({ isConfirmedPassword });
    return isConfirmedPassword;
  };

  passwordChangeHandler = createHandler(ev => {
    this.passwordChanged(ev.target.value);
  });

  repeatPasswordChangeHandler = createHandler(ev => {
    this.repeatPasswordChanged(ev.target.value);
  });

  passwordChanged = password => this.setState({ password, isPasswordValid: true });

  repeatPasswordChanged = repeatPassword => this.setState({ repeatPassword, isRepeatPasswordValid: true });

  validateForm = () => [this.validatePassword(), this.validateRepeatPassword(), this.confirmPassword()].every(Boolean);

  handleClickReset = async () => {
    const { isLoading, password, repeatPassword } = this.state;
    const { actions } = this.props;
    const valid = this.validateForm();

    if (!valid || isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      await actions.resetAsync({ password: password, token: this.props.location.pathname.substring(7) });
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false, password: '', repeatPassword: '' });
    }
  };

  renderRedirect = succsessMessage => {
    if (succsessMessage !== null) {
      setTimeout(() => this.setState({ redirect: true }), 3000);
    }
  };

  render() {
    const { isLoading, isPasswordValid, isRepeatPasswordValid, isConfirmedPassword } = this.state;
    const { isAuthorized, message, passwordNotReset, passwordReset } = this.props;
    const succsessMessage = passwordReset ? <Message color="teal">{message}</Message> : null;
    const failureMessage = passwordNotReset ? <Message color="red">{message}</Message> : null;
    this.renderRedirect(succsessMessage);
    if (this.state.redirect === true) return <Redirect to="/login" />;
    return !isAuthorized ? (
      <Grid textAlign="center" verticalAlign="middle" className="fill">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            Reset password
          </Header>
          {succsessMessage}
          <Form name="resetForm" size="large" onSubmit={this.handleClickReset}>
            <Segment>
              <Form.Input
                fluid
                disabled={passwordReset}
                placeholder="New password"
                type="password"
                error={!isPasswordValid}
                onChange={this.passwordChangeHandler()}
                onBlur={this.validatePassword}
              />
              <Form.Input
                fluid
                disabled={passwordReset}
                placeholder="Repeat password"
                type="password"
                error={!isRepeatPasswordValid && !isConfirmedPassword}
                onChange={this.repeatPasswordChangeHandler()}
                onBlur={this.validateRepeatPassword}
              />
              <Button type="submit" color="blue" fluid size="large" loading={isLoading} disabled={passwordReset}>
                Set new password
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
Reset.propTypes = {
  isAuthorized: PropTypes.bool,
  actions: PropTypes.object,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
  passwordNotReset: PropTypes.bool,
  passwordReset: PropTypes.bool
};

Reset.defaultProps = {
  isAuthorized: false,
  isLoading: false,
  message: '',
  passwordNotReset: false,
  passwordReset: false
};

const mapStateToProps = state => ({
  isAuthorized: state.auth.isAuthorized,
  message: state.reset.message,
  passwordNotReset: state.reset.passwordNotReset,
  passwordReset: state.reset.passwordReset
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...resetActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset);
