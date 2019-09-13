import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, ScrollView } from 'react-native';
import { getPullComments, mergePull, closePull, reopenPull, createPullComment } from '../../services/pullsService';
import PullComment from '../../components/PullComment';
import { socketInit } from '../../helpers/socketInitHelper';
import moment from 'moment';
import styles from './styles';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';

class IssueView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pullComments: [],
      comment: '',
      pullData: []
    };
  }

  initSocket() {
    this.socket = socketInit('pulls');
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

    this.socket.on('newPullComment', async data => {
      this.fetchPullComments();
    });

    this.socket.on('changedPullComments', async () => {
      this.fetchPullComments();
    });
  }

  async componentDidMount() {
    await this.fetchPullComments();
    this.initSocket();
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

  async fetchPullComments() {
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
      const pullComments = await getPullComments(id);
      this.setState({
        pullComments: pullComments.data,
        pullData: data
      });
    } catch (err) {}
  }

  handleMerge = async () => {
    const id = this.state.pullData.id;
    await mergePull({ id });
    this.props.navigation.goBack();
  };

  handleCLose = async () => {
    const id = this.state.pullData.id;
    await closePull({ id });
    this.props.navigation.goBack();
  };

  handleReopen = async () => {
    const id = this.state.pullData.id;
    await reopenPull({ id });
    this.props.navigation.goBack();
  };

  handleSubmit = async () => {
    const { comment } = this.state;
    const { data } = this.props.navigation.state.params;
    const result = await createPullComment({
      comment,
      pullId: data.id,
      userId: data.userId
    });
    this.setState({
      ...this.state,
      pullComments: [...this.state.pullComments, result],
      comment: ''
    });
  };

  render() {
    const { pullComments } = this.state;
    const { data, PullIcon } = this.props.navigation.state.params;
    let PRButtons;
    if (data.prstatus.name === 'OPEN') {
      PRButtons = (
        <View style={styles.pullButtons}>
          <Button
            buttonStyle={styles.pullButton}
            containerStyle={styles.mergeButton}
            title="Merge PR"
            titleStyle={styles.pullButtonsTitle}
            type="outline"
            onPress={this.handleMerge}
          />
          <Button
            buttonStyle={styles.pullButton}
            title="Close PR"
            titleStyle={styles.pullButtonsTitle}
            type="outline"
            onPress={this.handleCLose}
          />
        </View>
      );
    } else if (data.prstatus.name === 'CLOSED') {
      PRButtons = <Button title="Reopen PR" type="outline" onPress={this.handleReopen} />;
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.issue}>
          <View style={styles.header}>
            {PullIcon}
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
          data={pullComments}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <PullComment data={item} />}
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
            {PRButtons}
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
