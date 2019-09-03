import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { Header } from 'react-native-elements';

const DashboardHeader = () => (
  <Header
    leftComponent={{ text: 'asd', style: { color: '#fff' } }}
    centerComponent={{ text: 'Dashboard', style: { color: '#fff', fontSize: 20, paddingBottom: 20 } }}
    rightComponent={{ text: 'asd', style: { color: '#fff' } }}
    containerStyle={{
      height: 45,
      fontSize: 30
    }}
  />
);

export default DashboardHeader;
