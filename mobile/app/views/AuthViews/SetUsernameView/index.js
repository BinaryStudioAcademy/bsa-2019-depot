import React from 'react';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setUsernameRoutine } from '../../../routines/routines';

import { checkUsernameExists } from '../../../services/userService';
import styles from '../styles';

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
    .validateUsername('This username is already taken')
});

class SetUsernameView extends React.Component {
  setUsername = values => {
    const { username } = values;
    const { setUsernameRoutine, currentUser, navigation } = this.props;
    setUsernameRoutine({
      username,
      user: currentUser
    });
    navigation.navigate('Home');
  };
  renderComponent = ({ errors, handleChange, handleSubmit, values }) => {
    const { username } = values;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-200}>
        <View style={styles.form}>
          <Text style={styles.title}>{'Join Depot'}</Text>
          <TextInput
            selectionColor={'blue'}
            placeholder={'Username'}
            style={styles.textInput}
            onChangeText={handleChange('username')}
            value={username}
          />
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.text}>{'Set Username'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };
  render() {
    return (
      <Formik
        initialValues={{
          username: ''
        }}
        validationSchema={validationSchema}
        onSubmit={this.setUsername}
        render={this.renderComponent}
      />
    );
  }
}

SetUsernameView.propTypes = {
  navigation: PropTypes.object,
  setUsernameRoutine: PropTypes.func,
  currentUser: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

const mapDispatchToProps = { setUsernameRoutine };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetUsernameView);
