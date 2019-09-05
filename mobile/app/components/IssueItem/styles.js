import colors from '../../config/color.config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  data: {
    flexDirection: 'row',
    paddingLeft: 25
  },
  dataDate: {
    color: colors.greyText,
    fontSize: 15,
    paddingLeft: 7
  },
  dataNumber: {
    color: colors.greyText,
    fontSize: 15
  },
  dataUsername: {
    color: colors.greyText,
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
    color: colors.blueLink,
    fontSize: 20,
    paddingLeft: 10
  },
  issue: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    padding: 5
  }
});
