import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import Spinner from '../../components/Spinner';
import { getAllIssues } from '../../services/issueService';
import { connect } from 'react-redux';
import IssueItem from '../../components/IssueItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

class IssuesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOpened: true,
      sort: 'createdAt_DESC',
      owner: null,
      issuesData: {}
    };

    this.showOpen = this.showOpen.bind(this);
    this.showClosed = this.showClosed.bind(this);
  }

  async componentDidMount() {
    await this.fetchIssues();
  }

  async fetchIssues() {
    console.log(this.state);
    const { isOpened, sort, owner } = this.state;
    const { username } = this.props.currentUser;
    try {
      const issuesData = await getAllIssues(username, { isOpened, sort, owner });
      this.setState({
        ...this.state,
        isLoading: false,
        issuesData
      });
    } catch (err) {}
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

  render() {
    const { isLoading, issuesData, isOpened } = this.state;
    return !isLoading ? (
      <View>
        <View style={styles.issueHeader}>
          <Button
            title={issuesData.open + ' Open'}
            type="outline"
            onPress={this.showOpen}
            containerStyle={styles.leftButton}
          />
          <Button title={issuesData.close + ' Closed'} type="outline" onPress={this.showClosed} />
        </View>
        <FlatList
          data={issuesData.issues}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <IssueItem data={item} isOpened={isOpened} />}
        />
      </View>
    ) : (
      <Spinner />
    );
  }
}

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(IssuesView);
