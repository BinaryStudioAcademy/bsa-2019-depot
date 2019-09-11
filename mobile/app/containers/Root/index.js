import React from 'react';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../../routes';
import { fetchCurrentUser } from '../../routines/routines';
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';

import NavigationService from '../../navigation';
import storageHelper from '../../helpers/storageHelper';

class Root extends React.Component {
  async componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      'insider',
      'insider channel',
      firebase.notifications.Android.Importance.Max
    );
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
    const { fetchCurrentUser } = this.props;
    const token = await storageHelper.get('token');
    if (token)
      Promise.resolve()
        .then(() => {
          NavigationService.navigate('Home');
        })
        .then(() => {
          fetchCurrentUser();
        });
    else NavigationService.navigate('Auth');
  }

  async componentDidUpdate(prevProps) {
    const { isAuthorized, currentUser } = this.props;
    if (prevProps.isAuthorized !== isAuthorized && isAuthorized) {
      if (!currentUser.username) {
        NavigationService.navigate('SetUsername');
      } else {
        NavigationService.navigate('Home');
      }
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    //console.log(fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
        //console.log(fcmToken);
      }
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      //console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    firebase.notifications().onNotification(notification => {
      notification.android.setChannelId('insider').setSound('default');
      firebase.notifications().displayNotification(notification);
    });
  }

  getNavigator = navigatorRef => {
    NavigationService.setTopLevelNavigation(navigatorRef);
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <AppNavigator ref={this.getNavigator} />
      </Provider>
    );
  }
}

Root.propTypes = {
  isAuthorized: PropTypes.bool,
  fetchCurrentUser: PropTypes.func,
  store: PropTypes.object,
  currentUser: PropTypes.object
};

const mapStateToProps = ({ profile: { isAuthorized, currentUser } }) => ({
  isAuthorized,
  currentUser
});

const mapDispatchToProps = { fetchCurrentUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
