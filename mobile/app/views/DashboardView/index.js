import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SideMenu from 'react-native-side-menu';
import UserInfo from '../../components/UserInfo';
import ReposList from '../../containers/ReposList';
import Spinner from '../../components/Spinner';

import { getUserDetailed } from '../../services/userService';
import { getRepositories } from '../../services/repositoryService';
import { fetchCurrentUser } from '../../routines/routines';
import storageHelper from '../../helpers/storageHelper';
import { GoogleManager } from '../../config/google.config';

import styles from './styles';

class DashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      repos: []
    };
  }

  logOut = async () => {
    const { navigation, fetchCurrentUser } = this.props;
    storageHelper.clear();
    GoogleManager.deauthorize('google');
    await fetchCurrentUser();
    navigation.navigate('Auth');
  };

  async componentDidMount() {
    const { isAuthorized, navigation, currentUser } = this.props;
    if (!isAuthorized) {
      navigation.navigate('Auth');
    } else {
      const { username } = currentUser;
      const userData = await getUserDetailed(username);
      const repos = await getRepositories(username);
      this.setState({
        userData,
        repos
      });
    }
  }

  renderMenuComponent = () => {
    return (
      <View style={styles.menu}>
        <TouchableOpacity style={styles.logOut} onPress={this.logOut}>
          <Text style={styles.logOutText}>{'Log out'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { userData, repos } = this.state;
    const { loading } = this.props;
    return !loading ? (
      <SideMenu menu={this.renderMenuComponent()} openMenuOffset={200}>
        <View style={styles.container}>
          <UserInfo data={userData} />
          <ReposList repos={repos} />
        </View>
      </SideMenu>
    ) : (
      <Spinner />
    );
  }
}

DashboardView.propTypes = {
  navigation: PropTypes.object,
  fetchCurrentUser: PropTypes.func,
  isAuthorized: PropTypes.bool,
  currentUser: PropTypes.object,
  loading: PropTypes.bool
};

const mapStateToProps = ({ profile: { currentUser, isAuthorized, loading } }) => ({
  currentUser,
  isAuthorized,
  loading
});

const mapDispatchToProps = { fetchCurrentUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardView);
