import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

const MyStars = [
  { repository: 'moment / moment', description: 'React Calendar', updatedAt: 'Updated 2 days ago' },
  { repository: 'zeit / next.js', description: 'The React Framework', updatedAt: 'Updated 1 hour ago' },
  { repository: 'react-component / calendar ', description: 'Updated 10 hours ago' }
];

class StarsView extends React.Component {
  render() {
    return (
      <View>
        <Text>This is a list of Starred Repos </Text>
      </View>
    );
  }
}

export default StarsView;
