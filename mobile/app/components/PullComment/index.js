import React from 'react';
import moment from 'moment';
import { Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles';

const PullComment = ({
  data: {
    body,
    updatedAt,
    user: { username, imgUrl }
  }
}) => {
  const link = getUserImgLink(imgUrl);
  return (
    <View style={styles.comment}>
      <View style={styles.commentHeader}>
        <View style={styles.commentHeaderInfo}>
          <Image style={styles.avatar} source={{ uri: link }} />
          <Text style={styles.commentAuthor}>{username}</Text>
          <Text> commented </Text>
          <Text style={styles.commentDate}>{moment(updatedAt).fromNow()}</Text>
        </View>
      </View>
      <View style={styles.commentBody}>
        <Text>{body}</Text>
      </View>
    </View>
  );
};

PullComment.propTypes = {
  data: PropTypes.object
};

export default PullComment;
