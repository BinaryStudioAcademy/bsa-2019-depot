import React from 'react';
import { Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import publicIcon from '../../assets/public-repo-icon.png';
import privateIcon from '../../assets/private-repo-icon.png';
import starIcon from '../../assets/star-icon.png';

import styles from './styles';

const ReposListItem = ({ data: { name, description, starsCount, isPublic, website } }) => {
  const desc = description || website || null;
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Image style={styles.titleIcon} source={isPublic ? publicIcon : privateIcon} />
        <Text style={styles.titleText}>{name}</Text>
      </View>
      <View style={styles.descriptionView}>{desc ? <Text style={styles.descriptionText}>{desc}</Text> : null}</View>
      <View style={styles.starsView}>
        <Image style={styles.starIcon} source={starIcon} />
        <Text style={styles.starText}>{starsCount}</Text>
      </View>
    </View>
  );
};

ReposListItem.propTypes = {
  data: PropTypes.object
};

export default ReposListItem;
