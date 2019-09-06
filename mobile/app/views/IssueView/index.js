import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { getIssueComments, createIssueComment } from '../../services/issueService';
import IssueComment from '../../components/IssueComment';
import moment from 'moment';
import styles from './styles';

class IssueView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issueComments: [],
      comment: ''
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

  handleSubmit = async () => {
    const { comment } = this.state;
    const issueId = this.props.navigation.state.params.data.id;
    const userId = this.props.navigation.state.params.data.user.id;
    const result = await createIssueComment({
      comment,
      issueId,
      userId
    });
    console.log(this.state.issueComments, result);
    this.setState({
      ...this.state,
      issueComments: [...this.state.issueComments, result],
      comment: ''
    });
  };

  render() {
    const { issueComments } = this.state;
    const data = this.props.navigation.state.params.data;
    return (
      <ScrollView style={styles.container}>
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
        <View style={styles.commentInputContainer}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={comment => this.setState({ ...this.state, comment })}
            value={this.state.comment}
            style={styles.commentInput}
          />
          <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
            <Text style={styles.text}>{'Comment'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default IssueView;
