import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

class Notifications extends Component {
  render() {
    return (
      <View style={styles.menu}>
        <Text>Notification center</Text>
      </View>
    );
  }
}

export default Notifications;
