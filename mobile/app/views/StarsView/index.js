import React from 'react';
import { View, FlatList, ScrollView, RefreshControl } from 'react-native';
import styles from './styles';
import Spinner from '../../components/Spinner';
import { getAllStars } from '../../services/starsService';
import { connect } from 'react-redux';
import StarItem from '../../components/StarItem';
import PropTypes from 'prop-types';

class StarsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      starsData: [],
      refreshing: false
    };
  }

  async componentDidMount() {
    await this.fetchStars();
  }

  async fetchStars() {
    const { username } = this.props.currentUser;
    try {
      const starsData = await getAllStars(username);
      this.setState({
        ...this.state,
        isLoading: false,
        starsData
      });
    } catch (err) {}
  }

  handleRefresh = async () => {
    this.setState({
      refreshing: true
    });
    await this.fetchStars();
    this.setState({ refreshing: false });
  };

  render() {
    const { isLoading, starsData } = this.state;
    return !isLoading ? (
      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}>
        <View style={styles.starsHeader}></View>
        <FlatList
          data={starsData}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <StarItem data={item} />}
        />
      </ScrollView>
    ) : (
      <Spinner />
    );
  }
}

StarsView.propTypes = {
  currentUser: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(StarsView);
