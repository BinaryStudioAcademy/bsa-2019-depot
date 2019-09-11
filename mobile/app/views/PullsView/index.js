import React from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { getUserPulls } from '../../services/pullsService';
import { connect } from 'react-redux';
import { fetchCurrentUser } from '../../routines/routines';
import styles from '../PullsView/styles';
import { Button } from 'react-native-elements';
import PullItem from '../../components/PullItem';
import Spinner from '../../components/Spinner';
import PropTypes from 'prop-types';

class PullsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOpened: true,
      sort: 'createdAt_DESC',
      owner: null,
      reviewRequests: false,
      issuesData: {},
      refreshing: false
    };

    this.showOpen = this.showOpen.bind(this);
    this.showClosed = this.showClosed.bind(this);
  }

  async componentDidMount() {
    await this.fetchPulls();
  }

  async fetchPulls() {
    const { isOpened, sort, owner, reviewRequests } = this.state;
    const { username } = this.props.currentUser;
    if (username) {
      try {
        const pullsData = await getUserPulls(username, { isOpened, sort, owner, reviewRequests });
        this.setState({
          ...this.state,
          isLoading: false,
          pullsData
        });
      } catch (err) {}
    }
  }

  async showOpen() {
    this.setState(
      {
        isOpened: true
      },
      async () => await this.fetchPulls()
    );
  }

  async showClosed() {
    this.setState(
      {
        isOpened: false
      },
      async () => await this.fetchPulls()
    );
  }

  handleRefresh = async () => {
    this.setState({
      refreshing: true
    });
    await this.fetchPulls();
    this.setState({ refreshing: false });
  };

  render() {
    const { isLoading, pullsData, isOpened } = this.state;

    return !isLoading ? (
      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}>
        <View style={styles.pullHeader}>
          <Button
            title={pullsData.open + ' Open'}
            type="solid"
            onPress={this.showOpen}
            containerStyle={styles.leftButton}
            buttonStyle={styles.buttons}
          />
          <Button
            title={pullsData.close + ' Closed'}
            buttonStyle={styles.buttons}
            type="solid"
            onPress={this.showClosed}
          />
        </View>
        <FlatList
          data={pullsData.pulls}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <PullItem data={item} isOpened={isOpened} navigation={this.props.navigation} />}
        />
      </ScrollView>
    ) : (
      <Spinner />
    );
  }
}

PullsView.propTypes = {
  currentUser: PropTypes.object,
  navigation: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

const mapDispatchToProps = { fetchCurrentUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PullsView);
