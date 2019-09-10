import React from 'react';
import { Text, View, Image } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import publicIcon from '../../assets/public-repo-icon.png';
import privateIcon from '../../assets/private-repo-icon.png';
import styles from './styles';
import colors from '../../config/color.config';
import Icon from 'react-native-vector-icons/Octicons';

const ReposListItem = ({ data: { name, description, starsCount, isPublic, website, updatedAt } }) => {
  const desc = description || website || null;
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Image style={styles.titleIcon} source={isPublic ? publicIcon : privateIcon} />
        <Text style={styles.titleText}>{name}</Text>
      </View>
      <View style={styles.descriptionView}>{desc ? <Text style={styles.descriptionText}>{desc}</Text> : null}</View>
      <View style={styles.starsView}>
        <Icon name="star" size={20} color={colors.darkGrey} />
        <Text style={styles.starText}>{starsCount}</Text>
        <Text style={styles.dataDate}>{moment(updatedAt).fromNow()}</Text>
      </View>
    </View>
  );
};

ReposListItem.propTypes = {
  data: PropTypes.object
};

export default ReposListItem;
