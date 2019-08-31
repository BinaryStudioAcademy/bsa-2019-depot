import React from 'react';
import { Text, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import ReposListItem from '../../components/ReposListItem';

import styles from './styles';

const ReposList = ({ repos }) => {
  const isEmpty = !repos.length;
  return !isEmpty ? (
    <FlatList
      style={styles.form}
      data={repos}
      // eslint-disable-next-line react/jsx-no-bind
      renderItem={({ item }) => <ReposListItem data={item} />}
    />
  ) : (
    <View style={styles.form}>
      <Text style={styles.emptyText}>{'No one repository has been created yet =('}</Text>
    </View>
  );
};

ReposList.propTypes = {
  repos: PropTypes.array
};

export default ReposList;
