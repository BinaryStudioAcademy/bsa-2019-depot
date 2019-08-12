import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { resetActions } from './actions';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .matches(/^(?=.*\d[a-z]).{8,}|([a-zA-Z0-9]{15,})$/)
        .required('Password is required')
        .max(72),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], "Passwords don't match!")
        .required('Password is required')
});

class Reset extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
        this.state = {
            redirect: false
        };
    }

    async submit(values) {
        const { actions } = this.props;
        try {
            await actions.resetAsync({
                password: values.newPassword,
                token: this.props.location.pathname.substring(7)
            });
        } catch (error) {
            return error;
        }
    }

    renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
        const { message, passwordNotReset, passwordReset } = this.props;
        const succsessMessage = passwordReset ? <Message color="teal">{message}</Message> : null;
        const failureMessage = passwordNotReset ? <Message color="red">{message}</Message> : null;
        this.renderRedirect(succsessMessage);
        return (
            <Grid textAlign="center" verticalAlign="middle" className="reset-grid fill">
                <Grid.Column className="grid-column">
                    <Header as="h2" color="black" textAlign="center" className="reset-header">
            Reset password
                    </Header>
                    {succsessMessage}
                    <Form name="resetForm" size="large" onSubmit={handleSubmit}>
                        <Segment>
                            <Form.Input
                                fluid
                                name="newPassword"
                                value={values.newPassword}
                                label="New password"
                                disabled={passwordReset}
                                placeholder="New password"
                                type="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.newPassword && touched.newPassword ? 'has-error' : 'no-error'}`}
                            />
                            <Form.Input
                                fluid
                                name="repeatPassword"
                                value={values.repeatPassword}
                                label="Repeat password"
                                disabled={passwordReset}
                                placeholder="Repeat password"
                                type="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.repeatPassword && touched.repeatPassword ? 'has-error' : 'no-error'}`}
                            />
                            <Button
                                type="submit"
                                color="green"
                                fluid
                                size="large"
                                disabled={errors.repeatPassword && touched.repeatPassword}
                            >
                Set new password
                            </Button>
                        </Segment>
                        {failureMessage}
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }

  renderRedirect = succsessMessage => {
      if (succsessMessage !== null) {
          setTimeout(() => this.setState({ redirect: true }), 3000);
      }
  };

  render() {
      const { isAuthorized } = this.props;
      if (this.state.redirect === true) return <Redirect to="/login" />;
      return !isAuthorized ? (
          <Formik
              initialValues={{
                  newPassword: '',
                  repeatPassword: ''
              }}
              validationSchema={validationSchema}
              onSubmit={this.submit}
              render={this.renderComponent}
          />
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
    passwordReset: PropTypes.bool,
    location: PropTypes.object
};

Reset.defaultProps = {
    isAuthorized: false,
    isLoading: false,
    message: '',
    passwordNotReset: false,
    passwordReset: false
};

const mapStateToProps = state => ({
    isAuthorized: state.profile.isAuthorized,
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
