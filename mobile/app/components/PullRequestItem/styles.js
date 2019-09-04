import colors from '../../config/color.config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingLeft: 5,
    alignItems: 'center',
    paddingRight: 10
  },
  headerText: {
    paddingLeft: 10,
    fontSize: 20
  },
  data: {
    flexDirection: 'row',
    paddingLeft: 25
  },
  issue: {
    padding: 5,
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1
  },
  dataNumber: {
    fontSize: 15
  },
  dataDate: {
    paddingLeft: 7,
    fontSize: 15
  },
  dataUsername: {
    paddingLeft: 7,
    fontSize: 15
  }
});
