import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';
import { withNavigation } from 'react-navigation';

import styles from './styles';

const PullItem = ({ data, data: { title, number, user, updatedAt, prstatus }, navigation }) => {
  let PullIcon;
  if (prstatus.name === 'OPEN') {
    PullIcon = <Icon name="git-pull-request" size={20} color="#28a745" />;
  } else if (prstatus.name === 'CLOSED') {
    PullIcon = <Icon name="git-pull-request" size={20} color="#F05166" />;
  } else {
    PullIcon = <Icon name="git-pull-request" size={20} color="#916FCF" />;
  }

  function openIssue() {
    navigation.navigate('PullView', { data: data, PullIcon: PullIcon });
  }

  return (
    <View style={styles.issue}>
      <View style={styles.header}>
        {PullIcon}
        <Text style={styles.headerText} onPress={openIssue}>
          {title}
        </Text>
      </View>
      <View style={styles.data}>
        <Text style={styles.dataNumber}>#{number} opened</Text>
        <Text style={styles.dataDate}>{moment(updatedAt).fromNow()}</Text>
        <Text style={styles.dataUsername}>by {user.username}</Text>
      </View>
    </View>
  );
};

PullItem.propTypes = {
  data: PropTypes.object,
  isOpened: PropTypes.bool,
  navigation: PropTypes.object
};

export default withNavigation(PullItem);
