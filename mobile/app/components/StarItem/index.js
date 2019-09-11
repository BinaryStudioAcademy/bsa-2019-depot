import React from 'react';
import moment from 'moment';
import { Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';

import styles from './styles';
import colors from '../../config/color.config';
import repoIcon from '../../assets/public-repo-icon.png';

const StarItem = ({ data: { repository } }) => {
  return (
    <View style={styles.starItem}>
      <View style={styles.header}>
        <Image style={styles.titleIcon} source={repoIcon} />
        <Text style={styles.headerText}>
          {repository.user.username}/{repository.name}
        </Text>
      </View>
      <View style={styles.data}>
        <View style={styles.dataStars}>
          <Icon name="star" size={20} color={colors.darkGrey} />
          <Text style={styles.starsCounter}>{repository.starsCount}</Text>
        </View>
        <Text style={styles.dataDate}>{moment(repository.updatedAt).fromNow()}</Text>
      </View>
    </View>
  );
};

StarItem.propTypes = {
  data: PropTypes.object
};

export default StarItem;
