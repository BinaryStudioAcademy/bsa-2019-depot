import React from 'react';
import { Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { getUserImgLink } from '../../helpers/imageHelper';
import styles from './styles';

const UserInfo = ({ data: { username, name, imgUrl } }) => {
  const link = getUserImgLink(imgUrl);
  return (
    <View style={styles.form}>
      <Image style={styles.avatar} source={{ uri: link }} />
      {name ? <Text style={styles.name}>{name}</Text> : null}
      <Text style={styles.username}>{username}</Text>
    </View>
  );
};

UserInfo.propTypes = {
  data: PropTypes.object
};

export default UserInfo;
