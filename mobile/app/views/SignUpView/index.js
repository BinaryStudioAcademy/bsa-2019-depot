import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';

import colors from '../../config/color.config';

class SignUpView extends React.Component {
  toSignIn = () => this.props.navigation.navigate('SignIn');
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-200}>
        <View style={styles.form}>
          <Text style={styles.title}>{'Join Depot'}</Text>
          <TextInput selectionColor={'blue'} placeholder={'Username'} style={styles.textInput} />
          <TextInput selectionColor={'blue'} placeholder={'Email'} style={styles.textInput} />
          <TextInput selectionColor={'blue'} placeholder={'Password'} style={styles.textInput} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>{'Sign Up for Depot'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, ...styles.buttonGoogle }}>
            <Text style={{ ...styles.text, ...styles.textGoogle }}>{'Sign up with Google'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUp} onPress={this.toSignIn}>
            <Text style={styles.textCreateAccount}>
              {'Already have an account? '}
              <Text style={{ ...styles.textCreateAccount, ...styles.link }}>Sign in</Text>
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
  signUp: {
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
  },
  title: {
    color: colors.black,
    fontSize: 30,
    fontWeight: 'bold',
    height: 50,
    textAlign: 'center'
  }
});

SignUpView.propTypes = {
  navigation: PropTypes.object
};

export default SignUpView;
