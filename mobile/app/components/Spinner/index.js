import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import styles from './styles';
import colors from '../../config/color.config';

const Spinner = () => (
  <View style={styles.spinner}>
    <ActivityIndicator size="large" color={colors.blueButton} />
  </View>
);

export default Spinner;
