import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { InputError } from '../../components/InputError';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { forgotActions } from './actions';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address!')
    .matches(
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email address!'
    )
    .required('Email address is required!')
});

class Forgot extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  async submit(values) {
    const { actions } = this.props;
    try {
      await actions.forgotAsync({ email: values.email });
    } catch (error) {
      return error;
    }
  }

  returnToSignIn = () => {
    const { history } = this.props;
    history.push('/login');
  };

  renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
    const { message, emailNotExist, emailSend } = this.props;
    const succsessMessage = emailSend ? <Message color="teal">{message}</Message> : null;
    const failureMessage = emailNotExist ? <Message color="red">{message}</Message> : null;
    return (
      <Grid textAlign="center" className="forgot-grid fill">
        <Grid.Row>
          <Grid.Column className="grid-column">
            <Header as="h2" color="black" textAlign="center" className="forgot-header">
              Reset your password
            </Header>
            <Form name="forgotForm" size="large" onSubmit={handleSubmit} disabled={emailSend}>
              <Segment>
                {!succsessMessage ? (
                  <div>
                    <Form.Input
                      fluid
                      name="email"
                      label="Enter your email address and we will send you a link to reset your password."
                      disabled={emailSend}
                      placeholder="Enter your email address"
                      type="email"
                      error={emailNotExist}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={`${errors.email && touched.email ? 'has-error' : 'no-error'}`}
                    />
                    <InputError name="email" />
                    <Button type="submit" color="blue" fluid size="large" disabled={errors.email && touched.email}>
                      Send password reset email
                    </Button>
                  </div>
                ) : (
                  <div>
                    {succsessMessage}
                    <Button type="button" color="blue" fluid size="large" onClick={this.returnToSignIn}>
                      Return to sign in
                    </Button>
                  </div>
                )}
                {failureMessage}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    return (
      <Formik
        initialValues={{
          email: ''
        }}
        validationSchema={validationSchema}
        onSubmit={this.submit}
        render={this.renderComponent}
      />
    );
  }
}

Forgot.propTypes = {
  history: PropTypes.object,
  message: PropTypes.string,
  emailNotExist: PropTypes.bool,
  emailSend: PropTypes.bool,
  actions: PropTypes.object
};

Forgot.defaultProps = {
  isLoading: false,
  message: '',
  emailNotExist: false,
  emailSend: false
};

const mapStateToProps = state => ({
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
