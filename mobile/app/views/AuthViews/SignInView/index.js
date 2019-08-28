import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { authorizeUser } from '../../../routines/routines';

import styles from '../styles';
import imageLogo from '../../../assets/depot-logo.png';

class SignInView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
    const { authorizeUser } = this.props;
    authorizeUser({
      username: email,
      password
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
          <TouchableOpacity style={{ ...styles.button, ...styles.signInUp }} onPress={this.toSignUp}>
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
