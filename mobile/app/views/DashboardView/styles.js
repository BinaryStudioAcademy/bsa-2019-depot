import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'space-between'
  },
  logOut: {
    backgroundColor: colors.blueButton,
    width: '100%'
  },
  logOutText: {
    alignSelf: 'center',
    color: colors.white,
    fontWeight: 'bold'
  },
  spinner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  }
});
