import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchCurrentUser } from '../../routines/routines';
import storageHelper from '../../helpers/storageHelper';

class DashboardView extends React.Component {
  logOut = async () => {
    const { navigation, fetchCurrentUser } = this.props;
    storageHelper.clear();
    await fetchCurrentUser();
    navigation.navigate('Auth');
  };

  async componentDidMount() {
    const { isAuthorized, navigation } = this.props;
    if (!isAuthorized) navigation.navigate('Auth');
  }

  render() {
    const { email, username } = this.props.currentUser;
    return (
      <View>
        <Text>{username}</Text>
        <Text>{email}</Text>
        <TouchableOpacity onPress={this.logOut}>
          <Text>{'Log out'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

DashboardView.propTypes = {
  navigation: PropTypes.object,
  fetchCurrentUser: PropTypes.func,
  isAuthorized: PropTypes.bool,
  currentUser: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser, isAuthorized } }) => ({
  currentUser,
  isAuthorized
});

const mapDispatchToProps = { fetchCurrentUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardView);
