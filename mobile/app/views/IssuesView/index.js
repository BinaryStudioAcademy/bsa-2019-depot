import React from 'react';
import { Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import styles from './styles';
import Spinner from '../../components/Spinner';
import { getAllIssues } from '../../services/issueService';
import { connect } from 'react-redux';
import IssueItem from '../../components/IssueItem';

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
    const { isLoading, issuesData } = this.state;

    return !isLoading ? (
      <View>
        <View>
          <TouchableOpacity onPress={this.showOpen}>
            <Text>Open</Text>
            <Text>{issuesData.open}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.showClosed}>
            <Text>Closed</Text>
            <Text>{issuesData.close}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={issuesData.issues}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <IssueItem data={item} />}
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
