import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { signupRoutine } from '../../../routines/routines';
import { connect } from 'react-redux';

import styles from '../styles';

class SignUpView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: ''
    };
  }
  toSignIn = () => this.props.navigation.goBack();

  OnSignUp = () => {
    const { username, email, password } = this.state;
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

  handleChangeUsername = value => {
    this.setState({
      username: value
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-200}>
        <View style={styles.form}>
          <Text style={styles.title}>{'Join Depot'}</Text>
          <TextInput
            selectionColor={'blue'}
            placeholder={'Username'}
            style={styles.textInput}
            onChangeText={this.handleChangeUsername}
          />
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
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={this.OnSignUp}>
            <Text style={styles.text}>{'Sign Up for Depot'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, ...styles.buttonGoogle }}>
            <Text style={{ ...styles.text, ...styles.textGoogle }}>{'Sign up with Google'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, ...styles.signInUp }} onPress={this.toSignIn}>
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

SignUpView.propTypes = {
  navigation: PropTypes.object,
  signupRoutine: PropTypes.func
};

const mapStateToProps = ({ profile: { isAuthorized, loading, error, currentUser } }) => ({
  isAuthorized,
  loading,
  error,
  currentUser
});

const mapDispatchToProps = { signupRoutine };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpView);
