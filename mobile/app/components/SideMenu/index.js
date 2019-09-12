import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import UserInfo from '../UserInfo';
import { Button } from 'react-native-elements';
import styles from './styles';
import storageHelper from '../../helpers/storageHelper';
import { GoogleManager } from '../../config/google.config';
import { fetchCurrentUser } from '../../routines/routines';
import PropTypes from 'prop-types';

class SideMenu extends Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  logOut = async () => {
    const { navigation, fetchCurrentUser } = this.props;
    await storageHelper.clear();
    await GoogleManager.deauthorize('google');
    await fetchCurrentUser();
    navigation.navigate('Auth');
  };

  render() {
    const { currentUser } = this.props;
    return (
      <View style={styles.menu}>
        <UserInfo data={currentUser} />
        <View style={styles.menuBottom}>
          <Button title="Log out" type="solid" onPress={this.logOut} buttonStyle={styles.button} />
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
  fetchCurrentUser: PropTypes.func,
  currentUser: PropTypes.object
};

const mapDispatchToProps = { fetchCurrentUser };

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
