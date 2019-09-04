import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  issueHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    paddingBottom: 15,
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1
  },
  leftButton: {
    paddingRight: 5
  }
});
