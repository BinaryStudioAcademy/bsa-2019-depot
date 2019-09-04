import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

class DashboardHeader extends React.Component {
  render() {
    const hamburger = (
      <View style={styles.hamburger}>
        <Icon name="bars" size={30} color="#ffffff" onPress={() => this.props.navigation.openDrawer()} />
      </View>
    );

    const notification = (
      <View style={styles.hamburger}>
        <Icon name="bell-o" size={30} color="#ffffff" onPress={() => this.props.navigation.navigate('Notifications')} />
      </View>
    );

    return (
      <Header
        //leftComponent={<Button title="Back" onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} /> }
        leftComponent={hamburger}
        centerComponent={{ text: 'Dashboard', style: { color: '#fff', paddingBottom: 20, fontSize: 25 } }}
        rightComponent={notification}
        containerStyle={{
          height: 45
        }}
      />
    );
  }
}

// const DashboardHeader = () => (
//   <Header
//     leftComponent={{ text: 'asd', style: { color: '#fff' } }}
//     centerComponent={{ text: 'Dashboard', style: { color: '#fff', fontSize: 20, paddingBottom: 20 } }}
//     rightComponent={{ text: 'asd', style: { color: '#fff' } }}
//     containerStyle={{
//       height: 45,
//       fontSize: 30
//     }}
//   />
// );

export default withNavigation(DashboardHeader);
