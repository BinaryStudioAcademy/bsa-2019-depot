import React from 'react';
import moment from 'moment';
import { Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const IssueItem = ({ data: { title, number, user, updatedAt } }) => {
  return (
    <View style={styles.titleView}>
      <View>
        <Text>{title}</Text>
      </View>
      <View>
        <Text>{number}</Text>
        <Text>{moment(updatedAt).fromNow()}</Text>
        <Text>by {user.username}</Text>
      </View>
    </View>
  );
};

export default IssueItem;
