import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { forgotActions } from './actions';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address!')
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

    renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
        const { message, emailNotExist, emailSend } = this.props;
        const succsessMessage = emailSend ? <Message color="teal">{message}</Message> : null;
        const failureMessage = emailNotExist ? <Message color="red">{message}</Message> : null;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="forgot-grid fill">
                <Grid.Column className="grid-column">
                    <Header as="h2" color="black" textAlign="center" className="forgot-header">
            Reset your password
                    </Header>
                    {succsessMessage}
                    <Form name="forgotForm" size="large" onSubmit={handleSubmit} disabled={emailSend}>
                        <Segment>
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
                            <Button type="submit" color="green" fluid size="large" disabled={emailSend}>
                Send password reset email
                            </Button>
                        </Segment>
                        {failureMessage}
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
    render() {
        const { isAuthorized } = this.props;
        return !isAuthorized ? (
            <Formik
                initialValues={{
                    email: ''
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
Forgot.propTypes = {
    isAuthorized: PropTypes.bool.isRequired,
    message: PropTypes.string,
    emailNotExist: PropTypes.bool,
    emailSend: PropTypes.bool,
    actions: PropTypes.object
};

Forgot.defaultProps = {
    isAuthorized: false,
    isLoading: false,
    message: '',
    emailNotExist: false,
    emailSend: false
};

const mapStateToProps = state => ({
    isAuthorized: state.profile.isAuthorized,
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
