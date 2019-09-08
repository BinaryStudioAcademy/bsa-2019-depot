import React from 'react';
import { View, FlatList, ScrollView, RefreshControl } from 'react-native';
import styles from './styles';
import Spinner from '../../components/Spinner';
import { getAllIssues } from '../../services/issueService';
import { connect } from 'react-redux';
import IssueItem from '../../components/IssueItem';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { fetchCurrentUser } from '../../routines/routines';

class IssuesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOpened: true,
      sort: 'createdAt_DESC',
      owner: null,
      issuesData: {},
      refreshing: false
    };

    this.showOpen = this.showOpen.bind(this);
    this.showClosed = this.showClosed.bind(this);
  }

  async componentDidMount() {
    const { isAuthorized, navigation } = this.props;
    if (!isAuthorized) {
      navigation.navigate('Auth');
    } else {
      await this.fetchIssues();
    }
  }

  async fetchIssues() {
    const { isOpened, sort, owner } = this.state;
    const { username } = this.props.currentUser;
    if (username) {
      try {
        const issuesData = await getAllIssues(username, { isOpened, sort, owner });
        this.setState({
          ...this.state,
          isLoading: false,
          issuesData
        });
      } catch (err) {}
    }
  }

  async showOpen() {
    this.setState(
      {
        isOpened: true
      },
      async () => await this.fetchIssues()
    );
  }

  async showClosed() {
    this.setState(
      {
        isOpened: false
      },
      async () => await this.fetchIssues()
    );
  }

  handleRefresh = async () => {
    this.setState({
      refreshing: true
    });
    await this.fetchIssues();
    this.setState({ refreshing: false });
  };

  render() {
    const { isLoading, issuesData, isOpened } = this.state;
    return !isLoading ? (
      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}>
        <View style={styles.issueHeader}>
          <Button
            title={issuesData.open + ' Open'}
            type="solid"
            onPress={this.showOpen}
            containerStyle={styles.leftButton}
            buttonStyle={styles.buttons}
          />
          <Button
            title={issuesData.close + ' Closed'}
            buttonStyle={styles.buttons}
            type="solid"
            onPress={this.showClosed}
          />
        </View>
        <FlatList
          data={issuesData.issues}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <IssueItem data={item} isOpened={isOpened} navigation={this.props.navigation} />}
        />
      </ScrollView>
    ) : (
      <Spinner />
    );
  }
}

IssuesView.propTypes = {
  currentUser: PropTypes.object,
  navigation: PropTypes.object,
  isAuthorized: PropTypes.bool
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
)(IssuesView);
