import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';
import { withNavigation } from 'react-navigation';

import styles from './styles';

const IssueComment = ({ data }) => {
  return (
    <View style={styles.issue}>
      <Text>{data.body}</Text>
    </View>
  );
};

IssueComment.propTypes = {
  data: PropTypes.object
};

export default withNavigation(IssueComment);
