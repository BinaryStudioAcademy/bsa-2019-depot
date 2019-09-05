import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';

import styles from './styles';

const PullRequestItem = ({ data: { repository, pullRequestName, number, date, name }, isOpened }) => {
  return (
    <View style={styles.issue}>
      <View style={styles.header}>
        {isOpened ? (
          <Icon name="git-pull-request" size={20} color="#28a745" />
        ) : (
          <Icon name="git-merge" size={20} color="#ff0000" />
        )}
        <Text style={styles.headerText}>{repository + ' ' + pullRequestName}</Text>
      </View>
      <View style={styles.data}>
        <Text style={styles.dataNumber}>#{number} opened</Text>
        <Text style={styles.dataDate}>{moment(date).fromNow()}</Text>
        <Text style={styles.dataUsername}>by {name}</Text>
      </View>
    </View>
  );
};

PullRequestItem.propTypes = {
  data: PropTypes.object,
  isOpened: PropTypes.bool
};

export default PullRequestItem;
