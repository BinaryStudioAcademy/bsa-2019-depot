import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView } from 'react-native';

import { login } from '../../services/authService';

import colors from '../../config/color.config';
import imageLogo from '../../assets/depot-logo.png';

class SignInView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      username1: '',
      email1: ''
    };
  }

  handleChangeEmail = value => {
    this.setState({
      email: value
    });
  };

  handleChangePassword = value => {
    this.setState({
      password: value
    });
  };

  onLogin = async () => {
    const { email, password } = this.state;
    const res = await login({
      username: email,
      password
    });
    alert(res);
    this.setState({
      username1: res.token,
      email1: password
    });
  };

  toSignUp = () => this.props.navigation.navigate('SignUp');
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <TextInput
            selectionColor={'blue'}
            placeholder={'Email'}
            style={styles.textInput}
            onChangeText={this.handleChangeEmail}
          />
          <TextInput
            selectionColor={'blue'}
            placeholder={'Password'}
            style={styles.textInput}
            onChangeText={this.handleChangePassword}
          />
          <TouchableOpacity style={styles.button} onPress={this.onLogin}>
            <Text style={styles.text}>{'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, ...styles.buttonGoogle }}>
            <Text style={{ ...styles.text, ...styles.textGoogle }}>{'Sign in with Google'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signIn} onPress={this.toSignUp}>
            <Text style={styles.textCreateAccount}>
              {'New to Depot? '}
              <Text style={{ ...styles.textCreateAccount, ...styles.link }}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.blueButton,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    width: '100%'
  },
  buttonGoogle: {
    backgroundColor: colors.greyButton
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'space-between'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%'
  },
  link: {
    color: colors.blueLink
  },
  logo: {
    alignSelf: 'center',
    flex: 1,
    resizeMode: 'contain',
    width: '90%'
  },
  signIn: {
    alignItems: 'center',
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    width: '100%'
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    height: 20,
    textAlign: 'center'
  },
  textCreateAccount: {
    color: colors.black,
    height: 20,
    textAlign: 'center'
  },
  textGoogle: {
    color: colors.greyText
  },
  textInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.greyBorder,
    height: 40,
    marginBottom: 20
  }
});

SignInView.propTypes = {
  navigation: PropTypes.object
};

export default SignInView;
