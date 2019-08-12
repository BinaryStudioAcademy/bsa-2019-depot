import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Button, Segment, Label, Message } from 'semantic-ui-react';
import { signupRoutine } from '../../routines/routines';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './styles.module.scss';

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username address is required!')
        .matches(/^(([a-z0-9]+-)*[a-z0-9]+){1,39}$/),
    email: Yup.string()
        .email('Invalid email address!')
        .required('Email address is required!'),
    password: Yup.string()
        .matches(/^(?=.*\d[a-z]).{8,}|([a-zA-Z0-9]{15,})$/)
        .required('Password is required')
        .max(72)
});

class Signup extends React.Component {
    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
    }

    submit(values) {
        const user = {
            username: values.username,
            email: values.email,
            password: values.password
        };
        this.props.signupRoutine({
            user,
            history: this.props.history
        });
    }

    renderComponent({ errors, touched, handleChange, handleBlur, handleSubmit, values }) {
        const { loading, error } = this.props;
        return (
            <Grid textAlign="center" centered className="signup-grid">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="blue" textAlign="center">
            Join Depot
                    </Header>
                    <Form name="signupForm" size="large" onSubmit={handleSubmit} loading={loading} error={!!error}>
                        <Segment textAlign="left">
                            <Form.Field required>
                                <label htmlFor="username">Username</label>
                                <Form.Input
                                    fluid
                                    placeholder="Username"
                                    name="username"
                                    type="text"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`${errors.username && touched.username ? 'has-error' : 'no-error'}`}
                                />
                                {errors.username && touched.username && (
                                    <Label className="signup-pointing-label" pointing>
                    Username can contain alphanumeric characters and single hyphens, cannot begin or end with a hyphen
                                    </Label>
                                )}
                            </Form.Field>
                            <Form.Field required>
                                <label htmlFor="email">Email</label>
                                <Form.Input
                                    fluid
                                    placeholder="Email"
                                    name="email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`${errors.email && touched.email ? 'has-error' : 'no-error'}`}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label htmlFor="password">Password</label>
                                <Form.Input
                                    fluid
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`${errors.password && touched.password ? 'has-error' : 'no-error'}`}
                                />
                                {errors.password && touched.password && (
                                    <Label className="signup-pointing-label" pointing>
                    Password should be at least 8 characters, if it includes a number and a lowercase letter or 15
                    characters with any combination of characters
                                    </Label>
                                )}
                            </Form.Field>

                            <Button
                                type="submit"
                                color="blue"
                                fluid
                                size="large"
                                disabled={
                                    (errors.password && touched.password) ||
                  (errors.email && touched.email) ||
                  (errors.username && touched.username)
                                }
                            >
                Sign Up for Depot
                            </Button>
                            <Message error content={error} />
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }

    render() {
        return !this.props.isAuthorized ? (
            <Formik
                initialValues={{
                    username: '',
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

Signup.propTypes = {
    isAuthorized: PropTypes.bool,
    signupRoutine: PropTypes.func,
    error: PropTypes.string,
    loading: PropTypes.bool,
    history: PropTypes.object
};

const mapStateToProps = ({ profile: { isAuthorized, loading, error } }) => {
    return {
        isAuthorized,
        loading,
        error
    };
};

const mapDispatchToProps = { signupRoutine };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup);
