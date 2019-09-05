import colors from '../../config/color.config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  data: {
    flexDirection: 'row',
    paddingLeft: 25
  },
  dataDate: {
    fontSize: 15,
    paddingLeft: 7
  },
  dataNumber: {
    fontSize: 15
  },
  dataUsername: {
    fontSize: 15,
    paddingLeft: 7
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 10
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 10
  },
  issue: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    padding: 5
  }
});
