import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import UserInfo from '../UserInfo';
import { Button } from 'react-native-elements';
import styles from './styles';
import storageHelper from '../../helpers/storageHelper';
import { GoogleManager } from '../../config/google.config';
import { fetchCurrentUser } from '../../routines/routines';

class SideMenu extends Component {
  logOut = async () => {
    const { navigation, fetchCurrentUser } = this.props;
    storageHelper.clear();
    GoogleManager.deauthorize('google');
    await fetchCurrentUser();
    navigation.navigate('Auth');
  };

  render() {
    const { currentUser } = this.props;
    console.log(this.props);
    return (
      <View style={styles.menu}>
        <UserInfo data={currentUser} />

        <View style={styles.menuBottom}>
          <Button title="Log out" type="solid" onPress={this.logOut} />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = { fetchCurrentUser };

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
