import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  button: {
    backgroundColor: colors.blueLink
  },
  menu: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  menuBottom: {
    paddingBottom: 10,
    width: 150
  }
});
