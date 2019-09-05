import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';

import styles from './styles';

const IssueItem = ({ data: { title, number, user, updatedAt }, isOpened }) => {
  return (
    <View style={styles.issue}>
      <View style={styles.header}>
        {isOpened ? (
          <Icon name="issue-opened" size={20} color="#28a745" />
        ) : (
          <Icon name="issue-closed" size={20} color="#ff0000" />
        )}
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.data}>
        <Text style={styles.dataNumber}>#{number} opened</Text>
        <Text style={styles.dataDate}>{moment(updatedAt).fromNow()}</Text>
        <Text style={styles.dataUsername}>by {user.username}</Text>
      </View>
    </View>
  );
};

IssueItem.propTypes = {
  data: PropTypes.object,
  isOpened: PropTypes.bool
};

export default IssueItem;
