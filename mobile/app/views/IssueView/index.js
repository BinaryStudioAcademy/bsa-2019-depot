import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { getIssueComments, createIssueComment, closeIssue, reopenIssue } from '../../services/issueService';
import IssueComment from '../../components/IssueComment';
import { socketInit } from '../../helpers/socketInitHelper';
import moment from 'moment';
import styles from './styles';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';

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
    this.initSocket();
  }

  initSocket() {
    this.socket = socketInit('issues');
    const {
      navigation: {
        state: {
          params: {
            data: { id }
          }
        }
      }
    } = this.props;

    this.socket.emit('createRoom', id);

    this.socket.on('newIssueComment', async data => {
      const issueComments = await getIssueComments(id);
      this.setState({
        issueComments
      });
      /*this.setState({
        issueComments: [...this.state.issueComments, data]
      });*/
    });

    this.socket.on('changedIssueComments', async () => {
      this.fetchIssueComments();
    });
  }

  componentWillUnmount() {
    const {
      navigation: {
        state: {
          params: {
            data: { id }
          }
        }
      }
    } = this.props;
    this.socket.emit('leaveRoom', id);
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
            data: {
              id,
              title,
              user,
              repository: {
                user: { username }
              }
            }
          }
        }
      }
    } = this.props;
    const userId = user.id;
    await createIssueComment({
      comment,
      issueId: id,
      userId,
      username,
      title
    });
    this.setState({
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
            /* eslint-disable-next-line react/jsx-no-bind */
            onChangeText={comment => this.setState({ ...this.state, comment })}
            value={this.state.comment}
            style={styles.commentInput}
          />
          <View style={styles.issueButtons}>
            <Button
              title="Comment"
              type="solid"
              onPress={this.handleSubmit}
              disabled={this.state.comment.length < 1}
              containerStyle={styles.commentButtonContainer}
              buttonStyle={styles.commentButton}
            />
            <Button
              onPress={data.isOpened ? this.handleClose : this.handleReopen}
              title={data.isOpened ? 'Close Issue' : 'Reopen Issue'}
              buttonStyle={styles.issueButton}
              containerStyle={styles.issueButtonContainer}
              titleStyle={styles.issueButtonTitle}
              type="outline"
              icon={
                <Icon
                  name={data.isOpened ? 'issue-closed' : 'issue-reopened'}
                  size={15}
                  color="#DC6767"
                  style={styles.closeIcon}
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

IssueView.propTypes = {
  navigation: PropTypes.object
};

export default IssueView;
