import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  avatar: {
    borderColor: colors.darkGrey,
    borderWidth: 3,
    height: 150,
    resizeMode: 'contain',
    width: 150
  },
  form: {
    alignItems: 'center',
    paddingTop: '5%',
    width: '80%'
  },
  name: {
    color: colors.darkGrey,
    fontSize: 20
  },
  username: {
    color: colors.darkGrey,
    fontSize: 18
  }
});
