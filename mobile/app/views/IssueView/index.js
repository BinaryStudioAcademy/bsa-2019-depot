import React, { Component } from 'react';
import { Text, View, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { getIssueComments } from '../../services/issueService';
import IssueComment from '../../components/IssueComment';
import moment from 'moment';
import styles from './styles';

class IssueView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issueComments: {},
      comment
    };
  }

  async componentDidMount() {
    await this.fetchIssueComments();
  }

  async fetchIssueComments() {
    const id = this.props.navigation.state.params.data.id;
    try {
      const issueComments = await getIssueComments(id);
      this.setState({
        issueComments
      });
    } catch (err) {}
  }

  render() {
    const { issueComments } = this.state;
    const data = this.props.navigation.state.params.data;
    return (
      <View>
        <View style={styles.issue}>
          <View style={styles.header}>
            {data.isOpened ? (
              <Icon name="issue-opened" size={20} color="#28a745" />
            ) : (
              <Icon name="issue-closed" size={20} color="#ff0000" />
            )}
            <Text style={styles.headerText}>{data.title}</Text>
          </View>
          <View style={styles.data}>
            <Text style={styles.dataNumber}>#{data.number} opened</Text>
            <Text style={styles.dataDate}>{moment(data.updatedAt).fromNow()}</Text>
            <Text style={styles.dataUsername}>by {data.user.username}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.issueBody}>{data.body}</Text>
        </View>
        <FlatList
          data={issueComments}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <IssueComment data={item} />}
        />
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={comment => this.setState({ comment })}
          value={this.state.comment}
        />
      </View>
    );
  }
}

export default IssueView;
