import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  buttons: {
    backgroundColor: colors.blueButton
  },
  issueHeader: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 15,
    paddingLeft: 10,
    paddingTop: 10
  },
  leftButton: {
    paddingRight: 5
  }
});
