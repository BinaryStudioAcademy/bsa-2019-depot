import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

import styles from './styles';

class DashboardHeader extends React.Component {
  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  openNotifications = () => {
    this.props.navigation.navigate('Notifications');
  };

  render() {
    const hamburger = (
      <View style={styles.hamburger}>
        <Icon name="bars" size={30} color="#ffffff" onPress={this.openDrawer} />
      </View>
    );
    /*const notification = (
      <View style={styles.hamburger}>
        <Icon name="bell-o" size={30} color="#ffffff" onPress={this.openNotifications} />
      </View>
    );*/
    return (
      <Header
        leftComponent={hamburger}
        centerComponent={{ text: 'Dashboard', style: { color: '#fff', paddingBottom: 20, fontSize: 25 } }}
        containerStyle={styles.containerStyle}
      />
    );
  }
}

DashboardHeader.propTypes = {
  navigation: PropTypes.object
};

export default withNavigation(DashboardHeader);
