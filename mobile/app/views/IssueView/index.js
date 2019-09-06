/* eslint-disable */
import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { getIssueComments, createIssueComment, closeIssue, reopenIssue } from '../../services/issueService';
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
    const {
      navigation: {
        state: {
          params: {
            data,
            data: { id }
          }
        }
      }
    } = this.props;
    try {
      const issueComments = await getIssueComments(id);
      this.setState({
        issueComments,
        issueData: data
      });
    } catch (err) {}
  }

  handleSubmit = async () => {
    const { comment } = this.state;
    const {
      navigation: {
        state: {
          params: {
            data: { id, user }
          }
        }
      }
    } = this.props;
    const userId = user.id;
    const result = await createIssueComment({
      comment,
      issueId: id,
      userId
    });
    this.setState({
      ...this.state,
      issueComments: [...this.state.issueComments, result],
      comment: ''
    });
  };

  handleClose = async () => {
    const {
      navigation,
      navigation: {
        state: {
          params: {
            data: { id }
          }
        }
      }
    } = this.props;
    await closeIssue({
      id
    });
    navigation.navigate('Issues');
  };

  handleReopen = async () => {
    const {
      navigation,
      navigation: {
        state: {
          params: {
            data: { id }
          }
        }
      }
    } = this.props;
    await reopenIssue({
      id
    });
    navigation.navigate('Issues');
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
          <View style={styles.issueButtons}>
            <TouchableOpacity
              style={styles.commentButton}
              onPress={this.handleSubmit}
              disabled={this.state.comment.length < 1}
            >
              <Text style={styles.commentText}>{'Comment'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={data.isOpened ? this.handleClose : this.handleReopen}>
              <Icon
                name={data.isOpened ? 'issue-closed' : 'issue-reopened'}
                size={15}
                color="#DC6767"
                style={styles.closeIcon}
              />
              <Text style={styles.closeText}>{data.isOpened ? 'Close Issue' : 'Reopen Issue'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default IssueView;
