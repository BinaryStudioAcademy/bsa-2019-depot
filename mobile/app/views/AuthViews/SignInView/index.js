import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { authorizeUser } from '../../../routines/routines';
import { Formik } from 'formik';
import * as Yup from 'yup';

import styles from '../styles';
import imageLogo from '../../../assets/depot-logo.png';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address!')
    .matches(
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email address!'
    )
    .required('Email address is required!')
    .max(100),
  password: Yup.string()
    .matches(
      /^(?:(?=\D*\d)(?=[^a-z]*[a-z]).{8,}|[a-zA-Z0-9]{15,})$/,
      'Minimum length - 8 characters, and includes a number and a lowercase letter'
    )
    .required('Password is required')
    .max(72)
});

class SignInView extends React.Component {
  login = async values => {
    const { email, password } = values;
    const { authorizeUser } = this.props;
    authorizeUser({
      username: email,
      password
    });
  };

  toSignUp = () => this.props.navigation.navigate('SignUp');

  renderComponent = ({ errors, handleChange, handleSubmit, values }) => {
    const { email, password } = values;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <TextInput
            selectionColor={'blue'}
            placeholder={'Email'}
            style={styles.textInput}
            onChangeText={handleChange('email')}
            value={email}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextInput
            selectionColor={'blue'}
            placeholder={'Password'}
            style={styles.textInput}
            onChangeText={handleChange('password')}
            secureTextEntry={true}
            value={password}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.text}>{'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, ...styles.buttonGoogle }}>
            <Text style={{ ...styles.text, ...styles.textGoogle }}>{'Sign in with Google'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, ...styles.signInUp }} onPress={this.toSignUp}>
            <Text style={styles.textCreateAccount}>
              {'New to Depot? '}
              <Text style={{ ...styles.textCreateAccount, ...styles.link }}>Create an account</Text>
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
          password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={this.login}
        render={this.renderComponent}
      />
    );
  }
}

SignInView.propTypes = {
  navigation: PropTypes.object,
  authorizeUser: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool
};

const mapDispatchToProps = { authorizeUser };

export default connect(
  null,
  mapDispatchToProps
)(SignInView);
