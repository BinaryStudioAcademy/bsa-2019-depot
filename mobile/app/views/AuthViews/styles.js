import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.blueButton,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    width: '100%'
  },
  buttonGoogle: {
    backgroundColor: colors.greyButton
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'space-between'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%'
  },
  link: {
    color: colors.blueLink
  },
  logo: {
    alignSelf: 'center',
    flex: 1,
    resizeMode: 'contain',
    width: '90%'
  },
  // eslint-disable-next-line react-native/no-color-literals
  signInUp: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    height: 20,
    textAlign: 'center'
  },
  textCreateAccount: {
    color: colors.black,
    height: 20,
    textAlign: 'center'
  },
  textGoogle: {
    color: colors.greyText
  },
  textInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.greyBorder,
    height: 40,
    marginBottom: 20
  },
  title: {
    color: colors.black,
    fontSize: 30,
    fontWeight: 'bold',
    height: 50,
    textAlign: 'center'
  }
});
