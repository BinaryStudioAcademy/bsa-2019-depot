import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReposList from '../../containers/ReposList';
import Spinner from '../../components/Spinner';
import { getUserDetailed } from '../../services/userService';
import { getRepositories } from '../../services/repositoryService';
import { fetchCurrentUser } from '../../routines/routines';

import styles from './styles';

class ReposView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      repos: []
    };
  }

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

  render() {
    const { repos } = this.state;
    const { loading } = this.props;
    return !loading ? (
      <View style={styles.container}>
        <ReposList repos={repos} />
      </View>
    ) : (
      <Spinner />
    );
  }
}

ReposView.propTypes = {
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
)(ReposView);
