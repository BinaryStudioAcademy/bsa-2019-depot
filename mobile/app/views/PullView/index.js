import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getPullComments, mergePull, closePull, reopenPull } from '../../services/pullsService';
import PullComment from '../../components/PullComment';
import moment from 'moment';
import styles from './styles';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Octicons';

class IssueView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pullComments: [],
      comment: '',
      pullData: []
    };
  }

  async componentDidMount() {
    await this.fetchPullComments();
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
      console.log('pullComments', pullComments);
      this.setState({
        pullComments,
        pullData: data
      });
    } catch (err) {}
  }

  // handleSubmit = async () => {
  //   const { comment } = this.state;
  //   const {
  //     navigation: {
  //       state: {
  //         params: {
  //           data: { id, user }
  //         }
  //       }
  //     }
  //   } = this.props;
  //   const userId = user.id;
  //   const result = await createIssueComment({
  //     comment,
  //     issueId: id,
  //     userId
  //   });
  //   this.setState({
  //     ...this.state,
  //     issueComments: [...this.state.issueComments, result],
  //     comment: ''
  //   });
  // };
  //
  // handleClose = async () => {
  //   const {
  //     navigation,
  //     navigation: {
  //       state: {
  //         params: {
  //           data: { id }
  //         }
  //       }
  //     }
  //   } = this.props;
  //   await closeIssue({
  //     id
  //   });
  //   navigation.navigate('Issues');
  // };
  //
  // handleReopen = async () => {
  //   const {
  //     navigation,
  //     navigation: {
  //       state: {
  //         params: {
  //           data: { id }
  //         }
  //       }
  //     }
  //   } = this.props;
  //   await reopenIssue({
  //     id
  //   });
  //   navigation.navigate('Issues');
  // };

  handleMerge = async () => {
    const id = this.state.pullData.id;
    await mergePull({ id });
    this.props.navigation.goBack();
  };

  handleCLose = async () => {
    console.log('handleCLose');
    const id = this.state.pullData.id;
    console.log(id);
    const result = await closePull({ id });
    console.log(result);
    this.props.navigation.goBack();
  };

  handleReopen = async () => {
    const id = this.state.pullData.id;
    await reopenPull({ id });
    this.props.navigation.goBack();
  };

  render() {
    console.log('state', this.state);
    console.log(this.props);
    const { pullComments } = this.state;
    const { data, PullIcon } = this.props.navigation.state.params;
    let PRButtons;
    if (data.prstatus.name === 'OPEN') {
      PRButtons = (
        <>
          <Button title="Merge PR" type="outline" onPress={this.handleMerge} />
          <Button title="Close PR" type="outline" onPress={this.handleCLose} />
        </>
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
          data={pullComments.data}
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
            <TouchableOpacity
              style={styles.commentButton}
              onPress={this.handleSubmit}
              disabled={this.state.comment.length < 1}
            >
              <Text style={styles.commentText}>{'Comment'}</Text>
            </TouchableOpacity>
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
