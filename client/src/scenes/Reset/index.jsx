import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHandler from 'react-cached-handler';
import PropTypes from 'prop-types';
import validator from 'validator';

import { Grid, Header, Form, Button, Segment } from 'semantic-ui-react';

import './styles.module.scss';

//Actions
import { authActions } from '../../sagas/auth/actions';

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            repeatPassword: '',
            isLoading: false,
            isPasswordValid: true,
            isRepeatPasswordValid: true,
            isConfirmedPassword: true
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
          await actions.loginAsync({ password, repeatPassword }); //TODO need change action
      } catch (error) {
          this.setState({ isLoading: false });
      }
  };

  render() {
      const { isLoading, isPasswordValid, isRepeatPasswordValid, isConfirmedPassword } = this.state;
      return !this.props.isAuthorized ? (
          <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle" className="reset-grid">
              <Grid.Column style={{ maxWidth: 400 }}>
                  <Header as="h2" color="black" textAlign="center" className="reset-header">
            Reset password
                  </Header>
                  <Form name="resetForm" size="large" onSubmit={this.handleClickReset}>
                      <Segment>
                          <Form.Input
                              fluid
                              label="New password"
                              placeholder="New password"
                              type="password"
                              error={!isPasswordValid}
                              onChange={this.passwordChangeHandler()}
                              onBlur={this.validatePassword}
                          />
                          <Form.Input
                              fluid
                              label="Repeat password"
                              placeholder="Repeat password"
                              type="password"
                              error={!isRepeatPasswordValid && !isConfirmedPassword}
                              onChange={this.repeatPasswordChangeHandler()}
                              onBlur={this.validateRepeatPassword}
                          />
                          <Button type="submit" color="green" fluid size="large" loading={isLoading}>
                Set new password
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
Reset.propTypes = {
    isAuthorized: PropTypes.bool,
    actions: PropTypes.object,
    isLoading: PropTypes.bool
};

Reset.defaultProps = {
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
)(Reset);
