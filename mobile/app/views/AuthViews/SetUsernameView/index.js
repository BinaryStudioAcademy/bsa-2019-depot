import React from 'react';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';

import styles from '../styles';

class SetUsernameView extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-200}>
        <View style={styles.form}>
          <Text style={styles.title}>{'Join Depot'}</Text>
          <TextInput selectionColor={'blue'} placeholder={'Username'} style={styles.textInput} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>{'Set Username'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

SetUsernameView.propTypes = {
  navigation: PropTypes.object
};

export default SetUsernameView;
