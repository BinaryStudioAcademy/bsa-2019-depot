import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import Spinner from '../../components/Spinner';
import { getAllIssues } from '../../services/issueService';
import { connect } from 'react-redux';
import IssueItem from '../../components/IssueItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import PullRequestItem from '../../components/PullRequestItem';

const MyPullRequests = [
  {
    repository: 'andreoven/homepage',
    pullRequestName: 'Update base.css',
    number: '40',
    date: 'opened 13 days ago',
    name: 'andreoven '
  },
  {
    repository: 'BinaryStudioAcademy/bsa-2019-depot',
    pullRequestName: 'fix: Delete accidental file',
    number: '40',
    date: 'opened 13 days ago',
    name: 'andreoven '
  },
  {
    repository: 'andreoven/homepage',
    pullRequestName: 'Update base.css',
    number: '40',
    date: 'opened 13 days ago',
    name: 'andreoven '
  }
];

class PullsView extends React.Component {
  render() {
    const isOpened = true;

    return (
      <View>
        <View style={styles.pullHeader}>
          <Button title={'3 Open'} type="outline" containerStyle={styles.leftButton} />
          <Button title={'2 Closed'} type="outline" />
        </View>
        <FlatList
          data={MyPullRequests}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={({ item }) => <PullRequestItem data={item} isOpened={isOpened} />}
        />
      </View>
    );
  }
}

export default PullsView;
