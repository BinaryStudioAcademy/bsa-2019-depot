import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
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
      repos: [],
      isLoading: true,
      refreshing: false
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
        repos,
        isLoading: false
      });
    }
  }

  handleRefresh = async () => {
    this.setState({
      refreshing: true
    });
    const { username } = this.props.currentUser;
    const repos = await getRepositories(username);
    this.setState({ refreshing: false, repos });
  };

  render() {
    const { repos, isLoading } = this.state;
    return !isLoading ? (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}
      >
        <ReposList repos={repos} />
      </ScrollView>
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
