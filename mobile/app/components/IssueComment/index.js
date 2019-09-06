/* eslint-disable */
import React from 'react';
import moment from 'moment';
import { Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles';

/* { id: '8aeaecde-ac8f-4919-bbc3-1166a2e1f7f6',
      body: 'Hmmmmmm',
      createdAt: '2019-09-05T23:01:03.411Z',
      updatedAt: '2019-09-05T23:01:03.411Z',
      deletedAt: null,
      userId: 'bba84dda-ee5c-4442-8fc3-f07fda3e4d22',
      issueId: '2b7eb03c-8d20-440c-834d-f129b59c2104',
      user: { username: 'demo-mobile', imgUrl: null } } */

const IssueComment = ({
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

IssueComment.propTypes = {
  data: PropTypes.object
};

export default withNavigation(IssueComment);
