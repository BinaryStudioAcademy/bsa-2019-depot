import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'flex-start'
  },
  logOut: {
    backgroundColor: colors.blueButton,
    width: '100%'
  },
  logOutText: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold'
  },
  menu: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  spinner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  }
});
