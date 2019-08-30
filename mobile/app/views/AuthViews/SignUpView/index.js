/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { signupRoutine, loginGoogleRoutine } from '../../../routines/routines';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { checkUsernameExists } from '../../../services/userService';
import styles from '../styles';

import { scope, google_api, GoogleManager } from '../../../config/google.config';

const isUsernameValid = async username => {
  const { usernameExists } = await checkUsernameExists(username);
  return !usernameExists;
};

Yup.addMethod(Yup.string, 'validateUsername', function() {
  return this.test('validateUsername', 'This username is already taken', function(value) {
    return isUsernameValid(value);
  });
});

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required!')
    .matches(
      /^(([a-zA-Z0-9]+-)*[a-zA-Z0-9]+){1,39}$/,
      'Username contains of only alphanumeric characters or single hyphens. Cannot have multiple consecutive hyphens'
    )
    .validateUsername('This username is already taken'),
  email: Yup.string()
    .email('Invalid email address!')
    .matches(
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email address!'
    )
    .required('Email address is required!'),
  password: Yup.string()
    .matches(
      /^(?:(?=\D*\d)(?=[^a-z]*[a-z]).{8,}|[a-zA-Z0-9]{15,})$/,
      'Minimum length - 8 characters, and includes a number and a lowercase letter'
    )
    .required('Password is required')
    .max(72)
});

class SignUpView extends React.Component {
  toSignIn = () => this.props.navigation.goBack();

  signUp = values => {
    const { username, email, password } = values;
    const { signupRoutine } = this.props;
    const user = {
      username,
      email,
      password
    };
    signupRoutine({
      user
    });
  };

  googleLogin = () => {
    const { loginGoogleRoutine } = this.props;
    GoogleManager.authorize('google', { scopes: scope }).then(resp => {
      const token = resp.response.credentials.accessToken;
      const googleUrl = google_api;
      GoogleManager.makeRequest('google', googleUrl, {
        method: 'get',
        params: {
          alt: 'json',
          access_token: token
        }
      }).then(resp => {
        const { email } = resp.data;
        loginGoogleRoutine({ email });
      });
    });
  };
  renderComponent = ({ errors, handleChange, handleSubmit, values }) => {
    const { username, email, password } = values;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-200}>
        <View style={styles.form}>
          <Text style={styles.title}>{'Join Depot'}</Text>
          <TextInput
            selectionColor={'blue'}
            placeholder={'Username'}
            value={username}
            style={styles.textInput}
            onChangeText={handleChange('username')}
          />
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}
          <TextInput
            selectionColor={'blue'}
            placeholder={'Email'}
            value={email}
            style={styles.textInput}
            onChangeText={handleChange('email')}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextInput
            selectionColor={'blue'}
            placeholder={'Password'}
            value={password}
            style={styles.textInput}
            onChangeText={handleChange('password')}
            secureTextEntry={true}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.text}>{'Sign Up for Depot'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonGoogle]} onPress={this.googleLogin}>
            <Text style={[styles.text, styles.textGoogle]}>{'Sign up with Google'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.signInUp]} onPress={this.toSignIn}>
            <Text style={styles.textCreateAccount}>
              {'Already have an account? '}
              <Text style={[styles.textCreateAccount, styles.link]}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  render() {
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
          username: ''
        }}
        validationSchema={validationSchema}
        onSubmit={this.signUp}
        render={this.renderComponent}
      />
    );
  }
}

SignUpView.propTypes = {
  navigation: PropTypes.object,
  signupRoutine: PropTypes.func,
  loginGoogleRoutine: PropTypes.func
};

const mapStateToProps = ({ profile: { isAuthorized, loading, error, currentUser } }) => ({
  isAuthorized,
  loading,
  error,
  currentUser
});

const mapDispatchToProps = { signupRoutine, loginGoogleRoutine };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpView);
