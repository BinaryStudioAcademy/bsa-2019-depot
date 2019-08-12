import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Button, Segment, Message } from 'semantic-ui-react';
import { authorizeUser } from '../../routines/routines';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address!')
        .required('Email address is required!')
        .max(100),
    password: Yup.string()
        .matches(/^(?=.*\d[a-z]).{8,}|([a-zA-Z0-9]{15,})$/)
        .required('Password is required')
        .max(72)
});

class Login extends Component {
    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
    }

    submit(values) {
        this.props.authorizeUser({ username: values.email, password: values.password });
    }

    renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="login-grid">
                <Grid.Column className="grid-column">
                    <Header as="h2" color="black" textAlign="center" className="login-header">
            Sign in to Depot
                    </Header>
                    <Form name="loginForm" size="large" onSubmit={handleSubmit}>
                        <Segment>
                            <Form.Input
                                fluid
                                name="email"
                                label="Email"
                                placeholder="Email"
                                type="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={`${errors.email && touched.email ? 'has-error' : 'no-error'}`}
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
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={`${errors.password && touched.password ? 'has-error' : 'no-error'}`}
                                />
                            </Form.Field>
                            <Button type="submit" color="green" fluid size="large">
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
        );
    }

    render() {
        return !this.props.isAuthorized ? (
            <Formik
                initialValues={{
                    email: '',
                    password: ''
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
